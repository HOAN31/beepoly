import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-900 font-extrabold text-lg">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span>Beepoly</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-xs font-semibold text-blue-600">
            My Vocabulary
          </Link>
          <span className="text-xs font-medium text-slate-400 cursor-not-allowed">
            Review Session
          </span>
          <span className="text-xs font-medium text-slate-400 cursor-not-allowed">
            Analytics
          </span>
        </nav>
      </div>
    </header>
  );
};
