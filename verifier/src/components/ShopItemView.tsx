"use client"
import Image from "next/image";
import { Item } from "@prisma/client";
import useSWR from "swr";
import AmountPicker from "./AmountPicker";
import { useState } from "react";

export default function ShopItemView({ id }: { id: string }) {
    const [amount, setAmount] = useState(1);

    const { data, error, isLoading } = useSWR(`/api/items/${id}`, (url) =>
        fetch(url).then((res) => res.json())
    )

    const addItemToCart = () => {
        fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({
                item: data,
                quantity: amount,
            } as { item: Item, quantity: number }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    if (error) return <div>Error loading item</div>

    return (
        <div className="flex flex-col w-full gap-3">
            {isLoading && <div className="text-4xl">Loading...</div>}

            {data && (
                <div className="flex flex-row gap-3">
                    <Image src={data.imgUrl} alt="" className="rounded-md size-[30rem]" width={200} height={200} />
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-5xl font-semibold">{data.name}</h1>
                            <p className="text-xl">{data.description}</p>
                        </div>
                        <span className="p-3 rounded-md bg-blue-900 text-white w-fit">
                            <p className="text-5xl font-bold">${data.cost}</p>
                        </span>
                        <div className="flex flex-col gap-3">
                            <AmountPicker amount={amount} setAmount={setAmount} />
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer w-full"
                                onClick={() => addItemToCart()}
                            >
                                Add to cart
                            </button>
                        </div>
                    </div>
                </div >
            )
            }
        </div >
    )

}