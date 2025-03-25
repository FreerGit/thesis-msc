"use client"
import Item from "@/types";
import Image from "next/image";
import useCart from "@/hooks/useCart";

export default function ShopItemView({ item }: { item: Item }) {
    const { addToCart } = useCart()

    const addItemToCart = () => {
        addToCart(item)
    }

    return (
        <div className="flex flex-row gap-3">
            <Image src={item.imgUrl} alt="" className="rounded-md size-[30rem]" width={200} height={200} />
            <div className="flex flex-col justify-evenly">
                <div>
                    <h1 className="text-4xl font-semibold">{item.name}</h1>
                    <p className="text-md">{item.description}</p>
                </div>
                <div>
                    <p className="text-lg">${item.price}</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        onClick={() => addItemToCart()}
                    >
                        Add to cart
                    </button>

                </div>
            </div>
        </div>
    )

}