import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ParsedMail } from "../types/ParsedMail.type"

function downloadPdf(att) {
    const uint8 = new Uint8Array(att.content.data)
    const blob = new Blob([uint8], { type: att.contentType })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = att.filename
    a.click()

    URL.revokeObjectURL(url)
}

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

    console.log("mails", mails)

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

        const target = mails.pages?.[page]?.[element]
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
                <button className="back" title="powrót" onClick={() => navigate(`/mail#mail${params.id}`)}></button>
                <button className="user" title="nadawca..."></button>
                <button className="mail" title="mail..."></button>
                <span className="separator" />
                <span className="title">{mail.subject}</span>
                <div className='tag'></div>
            </div>
            <div style={{

            }} className="mailAttachments">

                {
                    mail.attachments.map((attachment, idx) => {
                        return (
                            <div className="Attachment"
                            
                                onClick={() => downloadPdf(attachment)}
                            >
                                <span style={{
                                    margin: 0
                                    
                                }}
                                // className="Attachment"
                                >{attachment.filename}</span>
                                {/* <span style={{
                                    margin: 0,
                                    right: 0,
                                    textAlign: "right"
                                }}>{attachment.contentType.split("/")[1].toUpperCase()}</span> */}
                            </div>
                        )
                    })
                }
            </div>
            <div
                className="mailDisplay"
                dangerouslySetInnerHTML={{ __html: mail.html }}
            />
        </>
    )
}

export default Mail
