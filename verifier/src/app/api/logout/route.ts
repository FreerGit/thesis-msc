import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
    const sessionId = (await cookies()).get("sessionId")?.value;

    const user = await prisma.session.findUnique({
        where: {
            id: sessionId,
        },
    });

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!sessionId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.session.deleteMany({
        where: {
            id: sessionId,
        },
    });

    (await cookies()).delete("sessionId");

    return NextResponse.json({ message: "Successfully logged out" });
}