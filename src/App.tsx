/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, PenTool, Lock, LogOut, Menu, X, Plus, Trash2, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './lib/api';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(!!api.getToken());

  useEffect(() => {
    const checkToken = () => setIsAdmin(!!api.getToken());
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLogout = () => {
    api.logout();
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden noise">
        {/* Background Scribbles Decoration */}
        <div className="fixed top-20 -left-10 opacity-10 pointer-events-none -rotate-12 transform select-none">
          <h1 className="text-9xl font-handwritten">Chaos</h1>
        </div>
        <div className="fixed bottom-20 -right-10 opacity-10 pointer-events-none rotate-12 transform select-none">
          <h1 className="text-9xl font-handwritten">Truth?</h1>
        </div>

        {/* Navbar */}
        <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center group">
          <Link to="/" className="relative">
            <h1 className="text-2xl font-typewriter font-bold transform -rotate-1 hover:rotate-0 transition-transform">
              <span className="highlight-yellow px-2">TEENAGE PSYCH BAGS</span>
            </h1>
            <div className="absolute -bottom-2 -left-2 w-full h-1 bg-ink opacity-20 -skew-x-12"></div>
          </Link>

          <div className="hidden md:flex gap-8 items-center font-marker">
            <Link to="/" className="hover:underline underline-offset-4">Identity</Link>
            <Link to="/" className="hover:underline underline-offset-4">Rage</Link>
            {isAdmin ? (
              <>
                <Link to="/admin" className="btn-scribble flex items-center gap-2">
                  <Lock size={16} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="text-ink hover:text-red-600 transition-colors">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="opacity-40 hover:opacity-100 transition-opacity">
                <Lock size={16} />
              </Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-0 z-40 bg-paper p-12 md:hidden flex flex-col gap-8 font-marker text-3xl"
            >
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Emotions</Link>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Identity</Link>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Rage</Link>
              {isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>}
              {!isAdmin && <Link to="/login" onClick={() => setIsMenuOpen(false)}>Admin</Link>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="py-20 text-center border-t border-ink border-opacity-10 mt-20">
          <p className="font-handwritten text-xl opacity-60">"The brain is a messy room where we store our best secrets."</p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="w-12 h-12 border-2 border-ink rounded-full flex items-center justify-center -rotate-6">IG</div>
            <div className="w-12 h-12 border-2 border-ink rounded-full flex items-center justify-center rotate-3">TT</div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

