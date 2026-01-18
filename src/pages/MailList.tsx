// MailList.tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MailRow from "../partials/mailView/MailRow";
import { getPaginatedMails } from "../service/apiFetchFunctions";
import { getActiveMailbox } from "../utils/mailboxStorage";
import type { ParsedMail } from "../types/ParsedMail.type";

function usePaginationInfo(data: any) {
    const pages = data?.pages ?? [];
    const currentPageIndex = pages.length - 1;
    const currentPage = pages[currentPageIndex] ?? {};

    return {
        currentPage: currentPage.page ?? 1,
        totalPages: currentPage.totalPages ?? 1,
        hasNextPage: currentPage.hasNextPage ?? false,
    };
}

const MailList = () => {
    const pagination = 20;
    const navigate = useNavigate();
    const activeMailbox = getActiveMailbox();

    // Redirect to add mailbox if none selected
    useEffect(() => {
        if (!activeMailbox) {
            navigate('/add-mailbox');
        }
    }, [activeMailbox, navigate]);

    const fetchMails = async ({ pageParam = 1 }: { pageParam?: number }) => {
        if (!activeMailbox) {
            throw new Error('No active mailbox');
        }
        return await getPaginatedMails(activeMailbox, pagination, pageParam);
    };

    const {
        data,
        error,
        fetchNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['emails-page', activeMailbox?.id],
        queryFn: fetchMails,
        initialPageParam: 1,
        staleTime: 60000,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
        enabled: !!activeMailbox, // Only run query if we have an active mailbox
    });

    const { hasNextPage } = usePaginationInfo(data);

    // Infinite scroll
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
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Load more if content doesn't fill screen
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
    }, [data, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Scroll to hash
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

    if (!activeMailbox) {
        return null;
    }

    return status === 'pending' ? (
        <p>Loading...</p>
    ) : status === 'error' ? (
        <div>
            <p>Error: {error.message}</p>
            <button onClick={() => navigate('/add-mailbox')}>
                Sprawdź ustawienia skrzynki
            </button>
        </div>
    ) : (
        <>
            <div className="mailContainer">
                <table border={0}>
                    <tbody>
                        {data.pages.map((group, i) => (
                            <>
                                {group.map((mail: ParsedMail, idx: number) => (
                                    <MailRow 
                                        key={`${i}_${idx}`}
                                        mail={mail} 
                                        openMail={() => navigate(`/mail/${i}_${idx}`)} 
                                        id={`mail${i}_${idx}`} 
                                    />
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

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
            </div>
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
        </>
    );
};

export default MailList;