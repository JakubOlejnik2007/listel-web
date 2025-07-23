import { useQuery } from "@tanstack/react-query";
import MailRow from "../partials/mailView/MailRow";
import { getPaginatedMails } from "../service/apiFetchFunctions";
import { useState } from "react";
import { useParams } from "react-router-dom";

const MailList = () => {
    const [page, setPage] = useState(0)

    const fetchEmailsQuery = useQuery({
        queryKey: ["emails-page"],
        queryFn: () => getPaginatedMails("POP3", 20, 1)
    })

    const { id } = useParams()

    console.log(id)

    return (
        <div className='mailContainer'>
            <table border={0}>
                <tbody>
                    {
                        fetchEmailsQuery.isSuccess && <>
                            {
                                (fetchEmailsQuery.data).map((mail, idx) => {
                                    return <MailRow mail={mail} />
                                })
                            }
                        </>
                    }</tbody>
            </table>
        </div>
    )
}

export default MailList