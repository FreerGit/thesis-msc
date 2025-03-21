import NavBar from "@/components/NavBar";
import ItemCard from "@/components/ItemCard";
import * as itemsList from "@/data/items.json";


export default function ShoppingPage() {
    const items = itemsList.items;


    return (
        <div className="flex flex-col p-8 gap-3">
            <NavBar></NavBar>

            {items && (
                <>
                    <div className="flex flex-row flex-wrap gap-4">
                        {items.map((item, index) => (
                            <ItemCard key={index} {...item} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}