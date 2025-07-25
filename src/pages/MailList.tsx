import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import MailRow from "../partials/mailView/MailRow";
import { getPaginatedMails } from "../service/apiFetchFunctions";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Mail from "./Mail";
import type { ParsedMail } from "../types/ParsedMail.type";


function usePaginationInfo(data: any) {
    const pages = data?.pages ?? []
    const currentPageIndex = pages.length - 1
    const currentPage = pages[currentPageIndex] ?? {}

    return {
        currentPage: currentPage.page ?? 1,
        totalPages: currentPage.totalPages ?? 1,
        hasNextPage: currentPage.hasNextPage ?? false,
    }
}



const MailList = () => {
    const pagination = 20
    const [mail, setMail] = useState(-1)


    const fetchMails = async ({ pageParam = 1 }: { pageParam?: number }) => {
        return await getPaginatedMails("POP3", pagination, pageParam)
    }


    const {
        data,
        error,
        fetchNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['emails-page'],
        queryFn: fetchMails,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    })


    const { currentPage, totalPages, hasNextPage } = usePaginationInfo(data)


    const { id } = useParams()

    const navigate = useNavigate()

    console.log(id)






    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, isFetchingNextPage]);


    useEffect(() => {
        const checkAndLoad = () => {
            if (
                document.body.scrollHeight <= window.innerHeight &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        };

        checkAndLoad();
    }, [data, hasNextPage, isFetchingNextPage]);




    useEffect(() => {
        if (status !== 'success') return;

        const hash = window.location.hash;
        if (!hash) return;

        requestAnimationFrame(() => {
            const el = document.querySelector(hash);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }, [status]);







    return status === 'pending' ? (
        <p>Loading...</p>
    ) : status === 'error' ? (
        <p>Error: {error.message}</p>
    ) : (
        <>
            <div className="mailContainer">
                <table border={0}>
                    <tbody>
                        {data.pages.map((group, i) => (
                            <>
                                {group.data.map((mail, idx) => (
                                    <MailRow mail={mail} openMail={() => navigate(`/mail/${i}_${idx}`)} id={`mail${i}_${idx}`} />
                                ))}
                            </>
                        ))}
                    </tbody> </table></div>

            <span className='pageEnd'>
                to już jest koniec...
            </span>
            <span className='logo'>Listel.</span>


            <div>
                <button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetching}
                >
                    {isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                            ? 'Load More'
                            : 'Nothing more to load'}

                </button>
                Strona {currentPage} z {totalPages}
            </div>
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>

        </>
    )
}

export default MailList