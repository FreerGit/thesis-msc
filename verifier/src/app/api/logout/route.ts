import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
    const sessionId = (await cookies()).get("sessionId")?.value;

    console.log(sessionId);

    if (!sessionId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.session.deleteMany({
        where: {
            id: sessionId,
        },
    });

    (await cookies()).set("sessionId", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0
    });

    return NextResponse.json({ message: "Successfully logged out" });
}