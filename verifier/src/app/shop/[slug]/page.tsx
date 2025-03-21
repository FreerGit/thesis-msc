import NavBar from "@/components/NavBar"
import ShopItemView from "@/components/ShopItemView"
import * as items from "@/data/items.json"

export default async function ShopItem({
    params
}: {
    params: Promise<{ slug: string }>
}) {

    const { slug } = await params

    const item = items.items.find((item) => item.id === parseInt(slug))

    return (
        <div className="flex flex-col w-full p-8 gap-3">
            <NavBar />
            {item ? (
                <ShopItemView item={item} />
            ) : (
                <div className="text-4xl font-semibold text-center">
                    Item not found, please try again.
                </div>
            )}
        </div>
    )
}