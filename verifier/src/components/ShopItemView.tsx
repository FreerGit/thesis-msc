"use client"
import Image from "next/image";
import { Item } from "@prisma/client";
import useSWR from "swr";

export default function ShopItemView({ id }: { id: string }) {

    const { data, error, isLoading } = useSWR(`/api/items/${id}`, (url) =>
        fetch(url).then((res) => res.json())
    )

    const addItemToCart = () => {
        fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({
                item: data,
                quantity: 1,
                userId: "123"
            } as { item: Item, quantity: number, userId: string }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    if (error) return <div>Error loading item</div>

    return (
        <div className="flex flex-col w-full p-8 gap-3">
            {isLoading && <div className="text-4xl">Loading...</div>}

            {data && (
                <div className="flex flex-row gap-3">
                    <Image src={data.imgUrl} alt="" className="rounded-md size-[30rem]" width={200} height={200} />
                    <div className="flex flex-col justify-evenly">
                        <div>
                            <h1 className="text-4xl font-semibold">{data.name}</h1>
                            <p className="text-md">{data.description}</p>
                        </div>
                        <div>
                            <p className="text-lg">${data.cost}</p>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                                onClick={() => addItemToCart()}
                            >
                                Add to cart
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}