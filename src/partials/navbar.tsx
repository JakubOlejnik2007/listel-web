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
  


  return (
    <nav> 
      <div className="mailDropdown">
        mati@ep09.net
      </div>
      <div className="search">
        <input id="search" placeholder="przeszukaj pocztę..."/>
        <button className="searchIcon"></button>
      </div>
    </nav>
  );
}

export default Nav;
