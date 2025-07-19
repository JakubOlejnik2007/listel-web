import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Nav from './partials/navbar.tsx'
import MailRow from './partials/mailView/MailRow.tsx'
import './styles/index.scss'
import './styles/animations.scss'
import './styles/app.scss'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getPaginatedMails } from './service/apiFetchFunctions.ts'
import MailList from './pages/MailList.tsx'

const queryClient = new QueryClient();

function App() {
  const [page, setPage] = useState(0)

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Nav></Nav>


        <MailList />
      </QueryClientProvider>
    </>
  )
}

export default App
