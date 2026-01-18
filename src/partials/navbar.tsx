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
    console.log('Switching to mailbox:', mailboxId);
    
    // Don't switch if already active
    if (mailboxId === activeMailbox?.id) {
      console.log('Already active, closing dropdown');
      setIsMailDropdownOpen(false);
      return;
    }
    
    console.log('Setting new active mailbox');
    setActiveMailbox(mailboxId);
    setIsMailDropdownOpen(false);
    
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
        onMouseDown={(e) => {
    const target = e.target as HTMLElement;

    // If click is inside the dropdown list, do nothing
    if (target.closest(".mailDropdownContainerList")) {
      return;
    }

    setIsMailDropdownOpen(prev => !prev);
  }}
  >

        {activeMailbox ? activeMailbox.email : "Wybierz skrzynkę"}

        <div className={`mailDropdownContainerList ${isMailDropdownOpen ? 'show' : ''}`}>
          {mailboxes.length === 0 ? (
            <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Brak skrzynek
            </div>
          ) : (
            mailboxes.map((mailbox) => (
              <div 
                key={mailbox.id}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  handleMailboxSwitch(mailbox.id);
                }}
                className={mailbox.id === activeMailbox?.id ? 'active' : ''}
              >
                {mailbox.email}
                {mailbox.id === activeMailbox?.id && ' ✓'}
              </div>
            ))
          )}
          
          <div onMouseUp={(e) => {
            e.stopPropagation();
            handleAddMailbox();
          }}>
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