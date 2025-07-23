export type ParsedEmailAddress = {
    name: string
    address: string
}

export type ParsedMail = {
    subject: string
    text: string
    html: string
    date: Date
    from: { value: ParsedEmailAddress[] }
    to: { value: ParsedEmailAddress[] }
    cc?: { value: ParsedEmailAddress[] }
    attachments: {
        filename: string
        contentType: string
        content: Buffer
    }[]
}
