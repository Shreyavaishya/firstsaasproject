import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getPrisma } from "@/lib/db"
import { getUsage } from "@/lib/usage"

export async function GET() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    try {
        return NextResponse.json(await getUsage(getPrisma(), userId))
    } catch (error) {
        console.error("Error fetching usage:", error)
        return NextResponse.json({ error: "Error fetching usage" }, { status: 500 })
    }
}
