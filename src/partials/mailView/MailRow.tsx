import React from "react";

function MailRow() {
  return (
    <tr>
    <td id='tag'><div className='tag'></div></td> 
    <td id='from'>OLX</td>
    <td id='content'>         
    <span id='title'>Potrzebujemy cie w naszym składzie</span>
    Nie zostawiaj nas! przygotowaliśmy dla ciebie wiele dobrych ofert, które już obserwowałeś!</td>
    <td id='date'>8 lip</td>
    </tr>
  );
}

export default MailRow;
