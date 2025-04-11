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

const updateOrCreateCart = async (userId: string, item: Item, quantity: number) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId: userId,
        },
    });

    const upsertCart = await prisma.cart.upsert({
        where: { id: cart?.id ?? "" },
        update: {
            cartItems: {
                upsert: {
                    where: {
                        cartId_itemId: {
                            cartId: cart?.id ?? "",
                            itemId: item.id,
                        },
                    },
                    update: {
                        quantity: quantity
                    },
                    create: {
                        itemId: item.id,
                        quantity: quantity,
                    },
                },
            }
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
    json: () => Promise<{ item: Item, quantity: number }>;
}) {
    const { item, quantity } = await req.json();

    const session = (await cookies()).get("sessionId")?.value;
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.session.findUnique({
        where: {
            id: session,
        },
    });

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const upsertCart = await updateOrCreateCart(user?.id, item, quantity);

    console.log("Cart", upsertCart);

    return NextResponse.json({ "message": "Item added to cart" }, { status: 200 });
}