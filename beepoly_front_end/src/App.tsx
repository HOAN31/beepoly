import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { DeckListPage } from './pages/DeckListPage';
import { DeckDetailPage } from './pages/DeckDetailPage';
import { ReviewSessionPage } from './pages/ReviewSessionPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ExamPracticePage } from './pages/ExamPracticePage';
import { ClassroomPage } from './pages/ClassroomPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DeckListPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/deck/:id" element={<DeckDetailPage />} />
            <Route path="/review/:deckId" element={<ReviewSessionPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/exam-practice" element={<ExamPracticePage />} />
            <Route path="/classroom" element={<ClassroomPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
