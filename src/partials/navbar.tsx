import React, { useState, useEffect } from "react";

function Nav() {

  document.addEventListener('keydown', function(event) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
    if ((isMac && event.metaKey && event.key === 'k') || 
        (!isMac && event.ctrlKey && event.key === 'k')) {
      event.preventDefault();
      let search = document.getElementById("search")
      search?.focus()
    }
  });
  

  const [isMailDropdownOpen, setIsMailDropdownOpen] = useState<boolean>(false);

  return (
    <nav> 
      <div className="mailDropdown" onMouseDown={() => setIsMailDropdownOpen(prev => !prev)} onMouseUp={() => console.log("unclicked")}>
        mati@ep09.net

          <div className={`mailDropdownContainerList ${isMailDropdownOpen ? 'show' : ''}`}>
            
            <div onMouseUp={() => setIsMailDropdownOpen(false)}>eszutmail@tenco.waw.pl</div>
            
            <div onMouseUp={() => setIsMailDropdownOpen(false)}>matiew58@gmail.com</div>
            <div onMouseUp={() => setIsMailDropdownOpen(false)}>+ dodaj skrzynkę</div>
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
