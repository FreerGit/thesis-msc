'use client'

import NavBar from "@/components/NavBar";
import ItemCard from "@/components/ItemCard";
import { Item } from "@prisma/client";
import useSWR from "swr";

export default function ShoppingPage() {

    const { data, error, isLoading } = useSWR('/api/items', (url) =>
        fetch(url).then((res) => res.json())
    )

    if (error) return <div>Error loading items</div>

    return (
        <div className="flex flex-col p-8 gap-3">
            <NavBar></NavBar>

            {isLoading && <div className="text-4xl">Loading...</div>}

            {data && (
                <div className="flex flex-row flex-wrap gap-4">
                    {data.map((item: Item, index: number) => (
                        <ItemCard key={index} {...item} />
                    ))}
                </div>
            )}
        </div>
    )
}