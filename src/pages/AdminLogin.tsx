import { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin({ setIsAdmin }: { setIsAdmin: (val: boolean) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.login(username, password);
      setIsAdmin(true);
      navigate('/admin');
    } catch (err) {
      setError('Invalid username or password. The ink is dry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white p-12 border-2 border-ink shadow-[10px_10px_0px_rgba(0,0,0,1)] relative rotate-1"
      >
        <div className="absolute -top-6 -left-6 bg-rage text-white p-3 rotate-[-12deg] font-marker text-xl shadow-lg">
          ADMIN ACCESS
        </div>

        <form onSubmit={handleLogin} className="space-y-8 pt-6">
          <div className="space-y-2">
            <label className="font-handwritten text-2xl">Who are you?</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-paper border-2 border-ink p-4 font-typewriter focus:outline-none focus:ring-2 ring-yellow-400"
              placeholder="username"
              required
            />
          </div>

          <div className="space-y-2 relative">
            <label className="font-handwritten text-2xl">Secrets?</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-paper border-2 border-ink p-4 font-typewriter focus:outline-none focus:ring-2 ring-yellow-400 pr-12"
                placeholder="password"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ x: -10 }} 
              animate={{ x: 0 }} 
              className="text-rage font-marker text-sm bg-red-50 p-2 border border-red-200"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-scribble text-2xl py-4 flex items-center justify-center gap-3"
          >
            <Lock size={20} /> {loading ? 'Unlocking...' : 'ENTER DIARY'}
          </button>
          
          <p className="text-center font-handwritten text-sm opacity-40">
            Forgot? You shouldn't have.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
