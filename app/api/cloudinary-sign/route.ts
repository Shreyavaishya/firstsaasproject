import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gives a logged-in user a short-lived signature so the browser can upload
// straight to Cloudinary (the file never passes through Vercel).
export async function POST(req: NextRequest) {
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

    const body = await req.json().catch(() => ({}));
    const kind: "image" | "video" = body?.kind === "image" ? "image" : "video";

    const timestamp = Math.round(Date.now() / 1000);
    const folder = `${kind}-uploads/${userId}`; // per-user folder = ownership proof
    const eager = kind === "video" ? "q_auto,f_mp4" : undefined;

    const params: Record<string, string | number> = { timestamp, folder };
    if (eager) params.eager = eager;

    const signature = cloudinary.utils.api_sign_request(params, apiSecret);

    return NextResponse.json({ signature, timestamp, folder, eager, apiKey, cloudName, resourceType: kind });
}
