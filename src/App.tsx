import { useState } from 'react'
import Nav from './partials/navbar.tsx'
import './styles/index.scss'
import './styles/animations.scss'
import './styles/app.scss'
import './styles/flat.scss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MailList from './pages/MailList.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mail from './pages/Mail.tsx'
import AddMailbox from './pages/AddMailbox.tsx'
import GmailCallback from './pages/GmailCallback.tsx'

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Nav />
          <Routes>
            <Route path='/mail' element={<MailList />} />
            <Route path='/mail/:id' element={<Mail />} />
            <Route path="/" element={<AddMailbox />} />
            <Route path="/add-mailbox" element={<AddMailbox />} />
            <Route path="/gmail-callback" element={<GmailCallback />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  )
}

export default App