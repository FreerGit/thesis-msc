'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import useSWR from "swr"

export default function NavBar() {
    const pathname = usePathname()

    const { data: session } = useSWR("/api/session", async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        return data
    })

    const { data: cartData, isValidating: cartIsValidating } = useSWR(session ? "/api/cart" : null, async (url: string | null) => {
        if (!url) return
        const response = await fetch(url)
        const data = await response.json()
        return data
    })

    return (
        <div className="flex gap-4 items-center justify-between w-full">
            <Link href="/">
                <h1 className="font-semibold text-3xl">Verifier</h1>
            </Link>

            <div className="flex w-full justify-evenly text-white text-xl">
                <Link
                    href="/shop"
                    className={pathname.includes("shop") ? "underline" : ""}
                >
                    Shop
                </Link>
                <Link
                    href="/about"
                    className={pathname === "/about" ? "underline" : ""}
                >
                    About
                </Link>
                <Link
                    href="/contact"
                    className={pathname === "/contact" ? "underline" : ""}
                >
                    Contact
                </Link>
            </div>

            <Link
                href="/cart"
            >
                <div className="flex items-center gap-1 cursor-pointer">
                    {cartIsValidating && <p className="text-white text-xl">...</p>}
                    {cartData !== null && <p className="text-white text-xl">{cartData}</p>}
                    <FontAwesomeIcon icon={faShoppingCart} />
                </div>
            </Link>
        </div >
    )
}