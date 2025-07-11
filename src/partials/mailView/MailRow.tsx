const MailRow = ({ mail }: any) => {

  const from = mail.from.value[0];
  const subject = mail.subject
  const date = new Date(mail.date);
  const today = new Date()
  const dateDiffHours = (today - date) / 1000 / 60 / 60


  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = mail.html;
  tempDiv.querySelectorAll("style").forEach(styleTag => styleTag.remove());
  console.log(tempDiv)
  const text = tempDiv.innerText




  return (
    <tr tabIndex={0}>
      <td id='tag'><div className='tag'></div></td>
      <td id='from'>{from.name ? from.name : from.address}</td>
      <td id='content'>
        <span id='title'>{subject}</span>
        {text}</td>
      <td id='date'>{dateDiffHours > 24 ? date.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "short"
      }) : date.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit"
      })}</td>
    </tr>
  );
}

export default MailRow;
