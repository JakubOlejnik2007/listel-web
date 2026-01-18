// apiFetchFunctions.ts
import { backend } from "../utils/config";
import createApiRequest from "./createApiRequest";
import type { Mailbox } from "../utils/mailboxStorage";
import { updateMailbox } from "../utils/mailboxStorage";

export const getPaginatedMails = async (
    mailbox: Mailbox,
    pagination: number,
    page: number,
    order?: number
) => {
    const protocol = mailbox.type.toLowerCase();
    
    if (mailbox.type === 'GMAIL') {
        const credentials = {
            accessToken: mailbox.accessToken,
            refreshToken: mailbox.refreshToken,
            pageToken: page > 1 ? mailbox.nextPageToken : undefined
        };
        
        const result = await createApiRequest(
            "POST",
            `${backend}/${protocol}/receive/${pagination}/${page}${order ? `/${order}` : ""}`,
            credentials
        );
        
        // Update mailbox with new pageToken for next page
        if (result.nextPageToken) {
            updateMailbox(mailbox.id, { nextPageToken: result.nextPageToken });
        }
        
        // Return normalized format
        return {
            emails: result.emails,
            page: page,
            hasNextPage: !!result.nextPageToken,
            totalPages: Infinity // Gmail doesn't have a concept of total pages
        };
    } else {
        const credentials = {
            email: mailbox.email,
            password: mailbox.password,
            host: mailbox.host,
            port: mailbox.port,
            tls: true
        };
        
        const emails = await createApiRequest(
            "POST",
            `${backend}/${protocol}/receive/${pagination}/${page}${order ? `/${order}` : ""}`,
            credentials
        );
        
        // Return normalized format
        return {
            emails: emails,
            page: page,
            hasNextPage: emails.length === pagination, // If we got full page, assume more exist
            totalPages: Infinity // We don't know total pages with POP3/IMAP
        };
    }
};

export const getGmailAuthUrl = async (): Promise<string> => {
    const response = await createApiRequest("GET", `${backend}/gmail/auth-url`);
    return response.authUrl;
};

export const exchangeGmailCode = async (code: string) => {
    return await createApiRequest("POST", `${backend}/gmail/callback`, { code });
};