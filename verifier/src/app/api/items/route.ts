import { NextResponse } from "next/server";
import prisma from "@/data/prisma";

const getAllItems = async () => {
    const items = await prisma.item.findMany();
    return items;
}

export async function GET() {
    const items = await getAllItems();
    return NextResponse.json(items);
}