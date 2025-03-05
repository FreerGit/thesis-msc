'use client'

import { FormEvent, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { vcService } from "@/services/vcService";
import { CredentialForm } from "@/types";


export default function Main() {
    const [loading, setLoading] = useState(false);

    const handleClicked = async (formEvent: FormEvent) => {
        formEvent.preventDefault()
        setLoading(true)

        const form = formEvent.target as HTMLFormElement;
        const formData = new FormData(form);

        const name = formData.get("name")?.toString()
        const ageStr = formData.get("age")?.toString()
        const email = formData.get("email")?.toString()
        const address = formData.get("address")?.toString()

        if (!name || !ageStr || !email || !address) {
            setLoading(false)
            return
        }

        const age = parseInt(ageStr)

        const data: CredentialForm = {
            name,
            age,
            email,
            address
        }

        console.log(await vcService.issueCredential(data))

        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

    return (
        <>
            <div className="flex flex-col justify-between items-center pt-10 gap-5">
                <h1 className="text-8xl font-extrabold">DID Issuer</h1>

                <form onSubmit={handleClicked} className="flex flex-col gap-2 w-96">
                    <input name="name" className="p-2 rounded-md text-black" type="text" minLength={2} placeholder="Enter name" />
                    <input name="age" className="p-2 rounded-md text-black" type="number" min={0} max={120} placeholder="Enter age" />
                    <input name="email" className="p-2 rounded-md text-black" type="email" placeholder="Enter email" />
                    <input name="address" className="p-2 rounded-md text-black" type="text" placeholder="Enter address" />
                    <button className="flex gap-1 items-center bg-sky-800 rounded-md p-2 hover:bg-sky-500" type="submit">
                        Issue DID
                        {loading && <LoadingSpinner />}
                    </button>
                </form>
            </div>
        </>
    )
}