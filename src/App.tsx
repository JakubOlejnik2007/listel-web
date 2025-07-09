import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Nav from './partials/navbar.tsx'
import MailRow from './partials/mailView/MailRow.tsx'
import './styles/index.scss'
import './styles/animations.scss'
import './styles/app.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Nav></Nav>

      <div className='mailContainer'>
        <table border={0}>
        <MailRow/>
        <MailRow/>
        <MailRow/>
        <MailRow/>
        <MailRow/>
        <MailRow/>
        <MailRow/>
        <MailRow/>
        <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
         <MailRow/>
        </table>
      </div>
      <span className='pageEnd'>
      to już jest koniec...
      </span>
      <span className='logo'>Listel.</span>
    </>
  )
}

export default App
