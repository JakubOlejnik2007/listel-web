// AddMailbox.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMailbox, type MailboxType } from "../utils/mailboxStorage";

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
        
        // Set default ports
        if (type === 'POP3') {
            setFormData(prev => ({ ...prev, port: '995' }));
        } else if (type === 'IMAP') {
            setFormData(prev => ({ ...prev, port: '993' }));
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

            if (selectedType === 'GMAIL') {
                setError('Gmail będzie dostępny wkrótce!');
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
        <div className="addMailboxContainer">
            <div className="brand">Listel</div>

            <div id="hrbox">
                <div id="hr"></div>
                <span id="hrboxmain">dodaj skrzynkę</span>
                <div id="hr"></div>
            </div>

            {!selectedType ? (
                <>
                    <button onClick={() => handleTypeSelect('GMAIL')}>Gmail</button>
                    <button onClick={() => handleTypeSelect('POP3')}>POP3</button>
                    <button onClick={() => handleTypeSelect('IMAP')}>IMAP</button>
                </>
            ) : (
                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                    <h3>{selectedType}</h3>
                    
                    {error && (
                        <div style={{ color: 'red', marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Email:
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="twoj@email.com"
                            style={{ width: '100%', padding: '0.5rem' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Hasło:
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '0.5rem' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Host:
                        </label>
                        <input
                            type="text"
                            name="host"
                            value={formData.host}
                            onChange={handleInputChange}
                            placeholder="mail.example.com"
                            style={{ width: '100%', padding: '0.5rem' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Port:
                        </label>
                        <input
                            type="number"
                            name="port"
                            value={formData.port}
                            onChange={handleInputChange}
                            placeholder={selectedType === 'POP3' ? '995' : '993'}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Dodawanie...' : 'Dodaj skrzynkę'}
                        </button>
                        <button type="button" onClick={handleCancel}>
                            Anuluj
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddMailbox;