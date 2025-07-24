import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ParsedMail } from "../types/ParsedMail.type"

const Mail = () => {
    const ID_REG = /^\d+_\d+$/;
    const [mail, setMail] = useState<ParsedMail | null>(null);

    const navigate = useNavigate()
    const params = useParams()
    const queryClient = useQueryClient()

    const mails = queryClient.getQueryData(["emails-page"]) as {
        pages: {
            data: ParsedMail[]
        }[]
    } | undefined

    useEffect(() => {
        console.log(!params.id, !ID_REG.test(params.id), !mails)
        if (!params.id || !ID_REG.test(params.id) || !mails) {
            navigate("/mail")
            return
        }

        const [pageStr, elementStr] = params.id.split("_")
        const page = parseInt(pageStr)
        const element = parseInt(elementStr)

        console.log(page, element, mails)

        const target = mails.pages?.[page]?.data?.[element]
        console.log(target)
        if (!target) {
            navigate("/mail")
            return
        }

        setMail(target)
    }, [params.id, mails, navigate])

    if (!mail) return null

    return (
        <>
            <div className="mailHeader">
                <button className="back" title="powrót" onClick={() => navigate(`/mail/`)}></button>
                <button className="user" title="nadawca..."></button>
                <button className="mail" title="mail..."></button>
                <span className="separator"/>
                <span className="title">{mail.subject}</span>
                <div className='tag'></div>
            </div>
            <div
                className="mailDisplay"
                dangerouslySetInnerHTML={{ __html: mail.html }}
            />
        </>
    )
}

export default Mail
