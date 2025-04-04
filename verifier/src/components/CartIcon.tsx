"use client"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import useSWR from "swr"

export default function CartIcon({ session }: { session: { message: string } }) {

    const { data: cartData } = useSWR(session && session?.message !== "Unauthorized" ? "/api/cart" : null, async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        return data
    })

    return (
        <Link
            href="/cart"
        >
            <div className="flex items-center gap-1 cursor-pointer">
                <p className="text-white text-xl">{cartData?.length ?? ""}</p>
                <FontAwesomeIcon icon={faShoppingCart} />
            </div>
        </Link>
    )
}