import { NextResponse } from "next/server";
import prisma from "@/data/prisma";

const getItemById = async (id: string) => {
    const item = await prisma.item.findUnique({
        where: { id: id },
    });
    return item;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await getItemById(id);
    return NextResponse.json(item);
}