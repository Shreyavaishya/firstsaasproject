import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gives a logged-in user a short-lived signature so the browser can upload
// straight to Cloudinary (the file never passes through Vercel).
export async function POST() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = `video-uploads/${userId}`; // per-user folder = ownership proof
    const eager = "q_auto,f_mp4";

    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder, eager },
        apiSecret
    );

    return NextResponse.json({ signature, timestamp, folder, eager, apiKey, cloudName });
}
