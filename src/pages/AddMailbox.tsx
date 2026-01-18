import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMailbox, type MailboxType } from "../utils/mailboxStorage";
import { getGmailAuthUrl } from "../service/apiFetchFunctions";

const AddMailbox = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState<MailboxType | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        host: '',
        port: '',
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTypeSelect = (type: MailboxType) => {
        setSelectedType(type);
        setError('');
        
        // For Gmail, redirect to OAuth flow
        if (type === 'GMAIL') {
            handleGmailAuth();
            return;
        }
        
        // Set default ports for POP3/IMAP
        if (type === 'POP3') {
            setFormData(prev => ({ ...prev, port: '995' }));
        } else if (type === 'IMAP') {
            setFormData(prev => ({ ...prev, port: '993' }));
        }
    };

    const handleGmailAuth = async () => {
        setIsLoading(true);
        try {
            const authUrl = await getGmailAuthUrl();
            // Redirect to Google OAuth
            window.location.href = authUrl;
        } catch (err) {
            setError('Nie udało się rozpocząć autoryzacji Gmail');
            setIsLoading(false);
            console.error(err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validate inputs
            if (!formData.email || !formData.password || !formData.host) {
                setError('Wypełnij wszystkie pola');
                setIsLoading(false);
                return;
            }

            // Add the mailbox
            const newMailbox = addMailbox({
                email: formData.email,
                type: selectedType!,
                host: formData.host,
                port: parseInt(formData.port) || (selectedType === 'POP3' ? 995 : 993),
                password: formData.password,
            });

            console.log('Mailbox added:', newMailbox);
            
            // Navigate back to mail list
            navigate('/mail');
            
            // Reload to fetch emails from new mailbox
            setTimeout(() => window.location.reload(), 100);
        } catch (err) {
            setError('Nie udało się dodać skrzynki');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/mail');
    };

    return (
        <div className={!selectedType ? ("addMailboxContainer"):("addMailboxContainer expand")}>
            <div className="brand">Listel</div>

            <div id="hrbox">
                <div id="hr"></div>
                <span id="hrboxmain">dodaj skrzynkę {selectedType}</span>
                <div id="hr"></div>
            </div>

            {!selectedType ? (
                <>
                    <button onClick={() => handleTypeSelect('GMAIL')}>Gmail</button>
                    <button onClick={() => handleTypeSelect('POP3')}>POP3</button>
                    <button onClick={() => handleTypeSelect('IMAP')}>IMAP</button>
                </>
            ) : (
                <form onSubmit={handleSubmit}>                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="inputform">
                        <label>
                            Email:
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="twoj@email.com"
                            required
                        />
                    </div>

                    <div className="inputform">
                        <label>
                            Hasło:
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="inputform">
                        <label>
                            Host
                        </label>
                        <input
                            type="text"
                            name="host"
                            value={formData.host}
                            onChange={handleInputChange}
                            placeholder="mail.example.com"
                            required
                        />
                    </div>

                    <div className="inputform">
                        <label>
                            Port
                        </label>
                        <input
                            type="number"
                            name="port"
                            value={formData.port}
                            onChange={handleInputChange}
                            placeholder={selectedType === 'POP3' ? '995' : '993'}
                        />
                    </div>

                    <div className="formbuttons">
                        <button type="button" onClick={handleCancel}>
                            Anuluj
                        </button>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Dodawanie...' : 'Dodaj skrzynkę'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddMailbox;