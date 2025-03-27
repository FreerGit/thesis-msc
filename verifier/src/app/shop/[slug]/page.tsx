import NavBar from "@/components/NavBar"
import ShopItemView from "@/components/ShopItemView"

export default async function ShopItem({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    return (
        <div className="flex flex-col w-full p-8 gap-3">
            <NavBar />
            {slug ? (
                <ShopItemView id={slug} />
            ) : (
                <div className="text-4xl font-semibold text-center">
                    Item not found, please try again.
                </div>
            )}
        </div>
    )
}