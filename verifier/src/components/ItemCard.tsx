import Image from "next/image";
import Link from "next/link";
import { Item } from "@prisma/client";

export default function ItemCard(item: Item) {
    return (
        <Link
            href="/shop/[slug]"
            as={`/shop/${item.id}`}
        >
            <div
                className="flex flex-row p-3 gap-3 bg-zinc-800 hover:bg-zinc-600 rounded-xl cursor-pointer w-[700px]"
            >
                <Image src={item.imgUrl} alt="" width={200} height={200} className="size-48 rounded-md" />
                <div className="flex flex-col gap-1 justify-evenly">
                    <div>
                        <h1 className="font-semibold text-5xl">{item.name}</h1>
                        <p className="text-lg">{item.description}</p>
                    </div>
                    <div
                        className="p-2 bg-zinc-700 rounded-md w-fit"
                    >
                        <p className="text-4xl">${item.cost}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}