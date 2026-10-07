import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DeckListPage } from './pages/DeckListPage';
import { DeckDetailPage } from './pages/DeckDetailPage';
import { ReviewSessionPage } from './pages/ReviewSessionPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DeckListPage />} />
            <Route path="/deck/:id" element={<DeckDetailPage />} />
            <Route path="/review/:deckId" element={<ReviewSessionPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
