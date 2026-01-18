// navbar.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMailboxes, getActiveMailbox, setActiveMailbox } from "../utils/mailboxStorage";
import type { Mailbox } from "../utils/mailboxStorage";

function Nav() {
  const navigate = useNavigate();
  const [isMailDropdownOpen, setIsMailDropdownOpen] = useState<boolean>(false);
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [activeMailbox, setActiveMailboxState] = useState<Mailbox | null>(null);

  // Load mailboxes on mount
  useEffect(() => {
    loadMailboxes();
  }, []);

  const loadMailboxes = () => {
    const boxes = getMailboxes();
    const active = getActiveMailbox();
    setMailboxes(boxes);
    setActiveMailboxState(active);
  };

  const handleMailboxSwitch = (mailboxId: string) => {
    setActiveMailbox(mailboxId);
    setIsMailDropdownOpen(false);
    loadMailboxes();
    // Refresh the page to load new mailbox
    window.location.reload();
  };

  const handleAddMailbox = () => {
    setIsMailDropdownOpen(false);
    navigate('/add-mailbox');
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      
      if ((isMac && event.metaKey && event.key === 'k') || 
          (!isMac && event.ctrlKey && event.key === 'k')) {
        event.preventDefault();
        const search = document.getElementById("search");
        search?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav> 
      <div 
        className="mailDropdown" 
        onMouseDown={() => setIsMailDropdownOpen(prev => !prev)}
      >
        {activeMailbox ? activeMailbox.email : "Wybierz skrzynkę"}

        <div className={`mailDropdownContainerList ${isMailDropdownOpen ? 'show' : ''}`}>
          {mailboxes.map((mailbox) => (
            <div 
              key={mailbox.id}
              onMouseUp={() => handleMailboxSwitch(mailbox.id)}
              style={{ 
                fontWeight: mailbox.id === activeMailbox?.id ? 'bold' : 'normal'
              }}
            >
              {mailbox.email}
            </div>
          ))}
          
          <div onMouseUp={handleAddMailbox}>
            + dodaj skrzynkę
          </div>
        </div>
      </div>

      <div className="search">
        <input id="search" placeholder="przeszukaj pocztę..."/>
        <button className="searchIcon"></button>
      </div>
    </nav>
  );
}

export default Nav;