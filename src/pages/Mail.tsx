import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const Mail = () => {
    const navigate = useNavigate()
    const params = useParams()
    const queryClient = useQueryClient()

    const mails = queryClient.getQueryData(["emails-page"]) as any[] | undefined
    const id = Number(params.id)

    const [mail, setMail] = useState<any | null>(null)

    useEffect(() => {
        if (!mails || isNaN(id) || id < 0 || id >= mails.length) {
            navigate("/mail")
            return
        }
        setMail(mails[id])
    }, [mails, id, navigate])

    if (!mail) return null

    return <div className="mailContainer">{mail.subject}</div>
}

export default Mail
