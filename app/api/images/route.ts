import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db";

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const prisma = getPrisma();
        const images = await prisma.image.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        return NextResponse.json({ error: "Error fetching images" }, { status: 500 });
    }
}
