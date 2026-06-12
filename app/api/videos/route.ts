import { NextRequest, NextResponse } from "next/server"
import { getPrisma } from '../../../lib/db' // Changed to named import

export async function GET(request: NextRequest) {
    try {
        // Initialize securely inside the request context
        const prisma = getPrisma() 
        
        const videos = await prisma.video.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json(videos)
    } catch (error) {
        console.error("Database connection error:", error)
        return NextResponse.json(
            { error: "Error fetching videos" }, 
            { status: 500 }
        )
    }
}