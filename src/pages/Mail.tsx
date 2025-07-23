import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ParsedMail } from "../types/ParsedMail.type"

const Mail = () => {
    const navigate = useNavigate()
    const params = useParams()
    const queryClient = useQueryClient()

    const mails = queryClient.getQueryData(["emails-page"]) as ParsedMail[] | undefined
    const id = Number(params.id)

    const [mail, setMail] = useState<ParsedMail | null>(null)

    useEffect(() => {
        if (!mails || isNaN(id) || id < 0 || id >= mails.length) {
            navigate("/mail")
            return
        }
        setMail(mails[id])
    }, [mails, id, navigate])



    if (!mail) return null
    console.log(mail.html)
    return <>
    <div className="mailSubject">{mail.subject}</div>
    <div className="mailDisplay">

        <iframe
            srcDoc={mail.html}
            style={{ width: '100%', height: '600px', border: 'none' }}
        />





    </div>
    </>
}

export default Mail
