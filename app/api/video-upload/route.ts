import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { getPrisma } from '@/lib/db';

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    eager?: { bytes?: number }[];
    duration?: number
    [key: string]: any
}

export async function POST(request: NextRequest) {


    try {
    const prisma = getPrisma();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in first.' },
        { status: 401 }
      );
    }
    if(
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    ){
        return NextResponse.json({error: "Cloudinary credentials not found"}, {status: 500})
    }

     const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 })
        }
        if (!file.type.startsWith("video/")) {
            return NextResponse.json({ error: "Only video files are allowed" }, { status: 400 })
        }
        if (!title || !title.trim()) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 })
        }

        // 🔹 Capture file size as an integer directly from the File object metadata
        const fileOriginalSize = file.size; 

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "video-uploads",
                        // 🔹 Using eager transformations ensures smooth background processing
                        eager: [
                            { quality: "auto", fetch_format: "mp4" }
                        ],
                        eager_async: false
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer)
            }
        )

        // 🔹 FIX: Map database values cleanly as native integers to match schema.prisma
        const video = await prisma.video.create({
            data: {
                userId,
                title: title.trim(),
                description: description || null,
                publicId: result.public_id,
                originalSize: fileOriginalSize,        // Passed as a native number Int
                // result.bytes is the ORIGINAL upload; the optimized rendition is in eager[0]
                compressedSize: Math.round(result.eager?.[0]?.bytes ?? result.bytes),
                duration: result.duration || 0,
            }
        })

        return NextResponse.json(video)

    } catch (error) {
        console.log("UPload video failed", error)
        return NextResponse.json({error: "UPload video failed"}, {status: 500})
    }
}

