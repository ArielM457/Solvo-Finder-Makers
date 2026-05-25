import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ConversationPage from './pages/Conversation'
import MetricsPage from './pages/Metrics'
import PipelinePage from './pages/Pipeline'

function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg text-muted">
      <Sidebar currentPath={location.pathname} />
      <main className="min-h-screen pb-20 lg:ml-72 lg:pb-0">
        <Routes>
          <Route path="/" element={<PipelinePage />} />
          <Route path="/conversation/:leadId" element={<ConversationPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return <AppLayout />
}
