'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import useSWR from "swr"
import CartIcon from "./CartIcon"

export default function NavBar() {
    const pathname = usePathname()

    const { data: session, error } = useSWR("/api/session", async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        return data
    })

    if (error) {
        return <p>Error</p>
    }

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
            </div>

            <CartIcon session={session}></CartIcon>
            <Link href={session && session?.message !== "Unauthorized" ? "/profile" : "/login"}>
                <button
                    className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
                >
                    Profile
                </button>
            </Link>
        </div >
    )
}