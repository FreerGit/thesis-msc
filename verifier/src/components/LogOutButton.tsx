'use client'

import { useRouter } from "next/navigation";

export default function LogOutButton() {
    const router = useRouter();
    const handleLogOut = async () => {
        const response = await fetch("/api/logout", {
            method: "POST",
        });
        if (response.ok) {
            router.push("/");
        }
    }

    return (
        <button
            className="bg-red-500 hover:bg-red-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLogOut()}
        >
            Log Out
        </button>
    )
}