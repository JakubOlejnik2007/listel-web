// apiFetchFunctions.ts
import { backend } from "../utils/config";
import createApiRequest from "./createApiRequest";
import type { Mailbox } from "../utils/mailboxStorage";

export const getPaginatedMails = async (
    mailbox: Mailbox,
    pagination: number,
    page: number,
    order?: number
) => {
    const protocol = mailbox.type.toLowerCase();
    
    // For Gmail, we'll handle this differently later
    if (mailbox.type === 'GMAIL') {
        throw new Error('Gmail support coming soon!');
    }
    
    const credentials = {
        email: mailbox.email,
        password: mailbox.password,
        host: mailbox.host,
        port: mailbox.port,
        tls: true
    };
    
    return await createApiRequest(
        "POST",
        `${backend}/${protocol}/receive/${pagination}/${page}${order ? `/${order}` : ""}`,
        credentials
    );
};