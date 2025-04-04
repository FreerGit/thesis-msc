import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/data/prisma";
import { Item } from "@prisma/client";

const getCartForUser = async (userId: string) => {
    const cart = await prisma.cart.findUnique({
        where: { userId: userId, },
        include: {
            cartItems: {
                include: {
                    item: true,
                },
            },
        },
    });
    console.log("Cart", cart);
    return cart;
}

export async function GET() {
    const sessionId = (await cookies()).get("sessionId")?.value;

    if (!sessionId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await getCartForUser(sessionId);

    if (!cart) {
        return NextResponse.json([]);
    }

    return NextResponse.json(cart?.cartItems);
}

const updateOrCreateCart = async (userId: string, item: Item) => {
    const upsertCart = await prisma.cart.upsert({
        where: { userId: userId },
        update: {
            cartItems: {
                create: {
                    itemId: item.id,
                    quantity: 1,
                },
            },
        },
        create: {
            cartItems: {
                create: {
                    itemId: item.id,
                    quantity: 1
                },
            },
            userId: userId,
        },
        include: {
            cartItems: {
                include: {
                    item: true,
                },
            },
        },
    });
    return upsertCart;
}

export async function POST(req: {
    json: () => Promise<{ item: Item, quantity: number, userId: string }>;
}) {
    const { item, userId } = await req.json();

    const upsertCart = await updateOrCreateCart(userId, item);

    return NextResponse.json(upsertCart?.cartItems);
}