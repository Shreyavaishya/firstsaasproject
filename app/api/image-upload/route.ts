import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // Cloudinary free plan: 10 MB per image
const MAX_PIXELS = 25_000_000; // Cloudinary free plan: 25 megapixels

// The browser has already uploaded the image to Cloudinary.
// Verify it belongs to this user and is within limits, then save a record.
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { publicId, title } = await req.json();
        if (typeof publicId !== "string" || !publicId.startsWith(`image-uploads/${userId}/`)) {
            return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
        }

        const asset = await cloudinary.api.resource(publicId, { resource_type: "image" });

        if (asset.bytes > MAX_IMAGE_BYTES) {
            await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
            return NextResponse.json({ error: "Image is larger than the 10 MB limit" }, { status: 413 });
        }
        if (asset.width * asset.height > MAX_PIXELS) {
            await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
            return NextResponse.json({ error: "Image is larger than 25 megapixels" }, { status: 413 });
        }

        const safeTitle = (typeof title === "string" && title.trim() ? title.trim() : "Untitled").slice(0, 100);

        const prisma = getPrisma();
        const image = await prisma.image.create({
            data: {
                userId,
                title: safeTitle,
                publicId,
                originalSize: Math.round(asset.bytes),
                width: Math.round(asset.width),
                height: Math.round(asset.height),
            },
        });

        return NextResponse.json(image);
    } catch (error) {
        console.log("Save image failed", error);
        return NextResponse.json({ error: "Could not save image" }, { status: 500 });
    }
}
