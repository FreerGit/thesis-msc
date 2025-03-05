// Purpose: Service for handling vc operations.

import { CredentialForm } from "@/types"
import { createUrl } from "./urlService"
import axios from "axios"

const issueCredential = async (data: CredentialForm) => {
    const url = createUrl("/issue-credential")

    const res = await axios.post(url, {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.data)

    return res
}


export const vcService = {
    issueCredential
}
