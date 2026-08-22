import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ParsedMail } from "../types/ParsedMail.type"
import { getActiveMailbox } from "../utils/mailboxStorage"

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

function extractBodyBackgroundFromDoc(doc: Document): string | undefined {
    if (!doc.body) return undefined
    const bg = getComputedStyle(doc.body).backgroundColor
    // ignore fully transparent backgrounds
    if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") return undefined
    return bg
}

const Mail = () => {
    const ID_REG = /^\d+_\d+$/;
    const [mail, setMail] = useState<ParsedMail | null>(null);
    const [bgColor, setBgColor] = useState<string | undefined>(undefined);

    const navigate = useNavigate()
    const params = useParams()
    const queryClient = useQueryClient()
    const activeMailbox = getActiveMailbox();

    // NOTE: confirm this shape matches what's actually stored in the cache.
    // If your pages are ParsedMail[][] (no .emails wrapper), change the
    // type below to { pages: ParsedMail[][] } and drop `.emails` in the
    // lookup further down.
    const mails = queryClient.getQueryData(['emails-page', activeMailbox?.id]) as {
        pages: { emails: ParsedMail[] }[]
    } | undefined

    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [iframeHeight, setIframeHeight] = useState(0)

    const handleIframeLoad = () => {
        const doc = iframeRef.current?.contentWindow?.document
        if (!doc) return

        // resize to fit content
        setIframeHeight(doc.body.scrollHeight)

        // extract bg color
        const bg = extractBodyBackgroundFromDoc(doc)
        setBgColor(bg)

        // force links to open in a new tab instead of navigating the iframe
        doc.querySelectorAll("a").forEach((a) => {
            a.setAttribute("target", "_blank")
            a.setAttribute("rel", "noopener noreferrer")
        })
    }

    useEffect(() => {
        if (!params.id || !ID_REG.test(params.id) || !mails) {
            navigate("/mail")
            return
        }

        const [pageStr, elementStr] = params.id.split("_")
        const page = parseInt(pageStr)
        const element = parseInt(elementStr)

        const target = mails.pages?.[page]?.emails?.[element]

        if (!target) {
            navigate("/mail")
            return
        }

        setMail(target)
    }, [params.id, mails, navigate])

    if (!mail) return null
	//TODO: TEXT INVISIBLE IN DARK MODE BECAUSE THE BROWSER DOES STUFF
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
            <div className="mailAttachments">
                {
                    mail.attachments.map((attachment, idx) => {
                        return (
                            <div
                                key={idx}
                                className="Attachment"
                                onClick={() => downloadPdf(attachment)}
                            >
                                <span style={{ margin: 0 }}>
                                    {attachment.filename}
                                </span>
                            </div>
                        )
                    })
                }
            </div>
            <iframe
                ref={iframeRef}
                className="mailDisplay"
                srcDoc={mail.html}
                onLoad={handleIframeLoad}
                sandbox="allow-same-origin allow-popups"
                style={{
					display: "block",
					padding: 0,
                    height: iframeHeight,
                    border: "none",
                    backgroundColor: bgColor ?? undefined,
                }}
            />
        </>
    )
}

export default Mail