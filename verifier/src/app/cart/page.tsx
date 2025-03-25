"use client"

import NavBar from "@/components/NavBar";
import useCart from "@/hooks/useCart";
import Image from "next/image";
import { useEffect, useState } from "react";
import CartItem from "@/types";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const { cart, clearCart } = useCart()

    useEffect(() => {
        setCartItems(cart)
    }, [cart])

    return (
        <div className="flex flex-col w-full p-8 gap-3">
            <NavBar />
            <div className="flex flex-col gap-3">
                <p className="text-4xl font-semibold">Your cart</p>
                {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-row gap-3">
                        <Image src={item.imgUrl} alt="" className="rounded-md" width={200} height={200} />
                        <div className="flex flex-col justify-evenly">
                            <div>
                                <h1 className="text-4xl font-semibold">{item.name}</h1>
                                <p className="text-md">{item.description}</p>
                            </div>
                            <p className="text-lg">${item.price}</p>
                            <p className="text-lg">Quantity: {item.quantity}</p>
                        </div>
                    </div>
                ))}

                {cartItems.length !== 0 && (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        onClick={() => {
                            clearCart()
                        }}
                    >
                        Clear cart
                    </button>
                )}

            </div>
        </div>
    )
}