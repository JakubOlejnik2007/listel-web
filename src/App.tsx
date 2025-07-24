import { useState } from 'react'
import Nav from './partials/navbar.tsx'
import MailRow from './partials/mailView/MailRow.tsx'
import './styles/index.scss'
import './styles/animations.scss'
import './styles/app.scss'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getPaginatedMails } from './service/apiFetchFunctions.ts'
import MailList from './pages/MailList.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mail from './pages/Mail.tsx'

const queryClient = new QueryClient();

function App() {
  const [page, setPage] = useState(0)

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Nav></Nav>
        <Router>
          <Routes>
            <Route path='/mail' element={<MailList />} />
            <Route path='/mail/:id' element={<Mail />} />


          </Routes>





        </Router>

      </QueryClientProvider>
    </>
  )
}

export default App
