import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    const sessionId = (await cookies()).get("sessionId")?.value;

    if (!sessionId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
        where: {
            id: sessionId,
        },
    });

    if (!session || session.expiresAt < new Date()) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.session.update({
        where: {
            id: sessionId,
        },
        data: {
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
    });

    return NextResponse.json({ userId: session.userId });
}