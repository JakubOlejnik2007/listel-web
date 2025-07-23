import { useQuery } from "@tanstack/react-query";
import MailRow from "../partials/mailView/MailRow";
import { getPaginatedMails } from "../service/apiFetchFunctions";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Mail from "./Mail";
import type { ParsedMail } from "../types/ParsedMail.type";

const MailList = () => {
    const [mail, setMail] = useState(-1)

    const fetchEmailsQuery = useQuery({
        queryKey: ["emails-page"],
        queryFn: () => getPaginatedMails("POP3", 20, 1)
    })

    const { id } = useParams()

    const navigate = useNavigate()

    console.log(id)

    return (
        <div className='mailContainer'>
            <table border={0}>
                <tbody>
                    {
                        fetchEmailsQuery.isSuccess && <>
                            {
                                (fetchEmailsQuery.data as ParsedMail[]).map((mail, idx) => {
                                    return <MailRow mail={mail} openMail={() => navigate(`/mail/${idx}`)} />
                                })
                            }
                        </>
                    }</tbody>
            </table>
        </div>
    )
}

export default MailList