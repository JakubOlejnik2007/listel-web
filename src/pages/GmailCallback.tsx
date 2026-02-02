// GmailCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeGmailCode } from "../service/apiFetchFunctions";
import { addMailbox } from "../utils/mailboxStorage";

const GmailCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const errorParam = searchParams.get('error');

            if (errorParam) {
                setStatus('error');
                setError('Anulowano autoryzację');
                return;
            }

            if (!code) {
                setStatus('error');
                setError('Brak kodu autoryzacji');
                return;
            }

            try {
                // Exchange code for tokens
                const tokens = await exchangeGmailCode(code);
                
                // Add mailbox with actual email from Google
                addMailbox({
                    email: tokens.email || 'Gmail Account',
                    type: 'GMAIL',
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token
                });

                setStatus('success');
                
                // Redirect to mail list after 1 second
                setTimeout(() => {
                    navigate('/mail');
                    window.location.reload();
                }, 1000);
            } catch (err) {
                console.error('Error during Gmail OAuth:', err);
                setStatus('error');
                setError('Nie udało się połączyć z Gmail');
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <>
        <div className="addMailboxContainer">
            <div className="brand">Listel</div>
            
            <div id="hrbox">
                <div id="hr"></div>
                <span id="hrboxmain">
                    {/* {status === 'loading' && 'Łączenie z Gmail...'}
                    {status === 'success' && 'Połączono!'}
                    {status === 'error' && 'Błąd'} */}
                    Łączenie z Gmail
                </span>
                <div id="hr"></div>
            </div>

            {status === 'loading' && (
                <p style={{ textAlign: 'center', color: 'var(--dark)' }}>
                    Proszę czekać...
                </p>
            )}

            {status === 'success' && (
                <div style={{ textAlign: 'center', color: 'var(--dark)', height:"140px", lineHeight:"140px" }}>
                    odświeżanie
                </div>
            )}


        </div>
            {status === 'error' && (
                <div className="dialog">
                    <div className="error">
                        {error}
                    </div>
                    <button onClick={() => navigate('/add-mailbox')}>
                        Spróbuj ponownie
                    </button>
                </div>
            )}
        </>
    );
};

export default GmailCallback;