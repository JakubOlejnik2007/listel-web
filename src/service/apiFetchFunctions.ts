import { backend } from "../utils/config";
import createApiRequest from "./createApiRequest";

export const getPaginatedMails = async (protocol: "POP3" | "IMAP" | "SMTP", pagination: number, page: number, order?: number) =>
    await createApiRequest("GET", `${backend}/${protocol}/receive/${pagination}/${page}${order ? `/${order}` : ""}`);