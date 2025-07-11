import { useQuery } from "react-query";
import MailRow from "../partials/mailView/MailRow";
import { getPaginatedMails } from "../service/apiFetchFunctions";
import { useState } from "react";

const MailList = () => {
    const [page, setPage] = useState(0)
    const solvedProblemQuery = useQuery(["solved-problems", page], () => getPaginatedMails("POP3", 20, 1));


    return (
        <div className='mailContainer'>
            <table border={0}>
                <tbody>
                    {
                        solvedProblemQuery.isSuccess && <>
                            {
                                (solvedProblemQuery.data).map((mail, idx) => {
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