"use client";

import { useRouter } from "next/navigation";

export default function LogOutButton() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("sessionToken");
        router.push("/");
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
            Log Out
        </button>
    );
}
