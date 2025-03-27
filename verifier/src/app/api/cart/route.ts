import { NextResponse } from "next/server";
import prisma from "@/data/prisma";
import { Item } from "@prisma/client";

const getCartForUser = async (userId: string) => {
    const cart = await prisma.cart.findUnique({
        where: { userId: userId, },
    });
    return cart;
}

export async function GET() {
    const cart = await getCartForUser("123");
    return NextResponse.json(cart);
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
    });
    return upsertCart;
}

export async function POST(req: {
    json: () => Promise<{ item: Item, quantity: number, userId: string }>;
}) {
    const { item, quantity, userId } = await req.json();

    const upsertCart = await updateOrCreateCart(userId, item);

    return NextResponse.json(upsertCart);
}