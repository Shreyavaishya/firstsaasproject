import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getPrisma } from "@/lib/db"

export async function GET() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const prisma = getPrisma()
        // Only ever return the signed-in user's own videos
        const videos = await prisma.video.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(videos)
    } catch (error) {
        console.error("Error fetching videos:", error)
        return NextResponse.json({ error: "Error fetching videos" }, { status: 500 })
    }
}
