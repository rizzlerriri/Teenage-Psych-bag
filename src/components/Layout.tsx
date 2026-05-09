import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import RansomTitle from './RansomTitle';
import DisturbMyPeace from './DisturbMyPeace';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-gray-200">
      <div className="night-sky-bg" />
      <div className="film-grain" />
      <div className="dark-overlay" />
      
      <header className="relative z-10 pt-8 pb-4 px-4 border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/">
            <div className="bg-[#fef9c3] p-2 shadow-md relative inline-block w-40 md:w-48 transform -rotate-2 hover:rotate-1 transition-transform">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/40 mask-tape backdrop-blur-sm" />
              <img src="/teenage-psychbag-logo.png" alt="teenage psychbag logo" className="w-full h-auto mix-blend-multiply" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
              <div className="hidden">
                 <RansomTitle text={"teenage\npsychbag"} size="sm" />
              </div>
            </div>
          </Link>
          
          <nav className="flex flex-wrap items-center justify-center gap-6 font-marker text-lg text-gray-300">
            <Link to="/about" className="relative group hover:text-white transition-colors">
              <span>about me</span>
              <motion.span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link to="/blog" className="relative group hover:text-white transition-colors">
              <span>the diary</span>
              <motion.span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link to="/secret" className="rotate-3 ml-4 bg-yellow-400 text-black px-3 py-1 font-typewriter text-sm hover:rotate-6 hover:bg-yellow-300 transition-all shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]">
              [admin]
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12 min-h-[70vh]">
        <motion.div
  key={location.pathname}
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
>
          <Outlet />
        </motion.div>
      </main>
      
      <DisturbMyPeace />

      <footer className="relative z-10 mt-20 pb-8 text-center border-t border-white/10 pt-10 px-4">
         <div className="flex flex-col items-center justify-center gap-4">
           <div className="w-32 h-px bg-yellow-400/50" />
           <p className="font-editors-note italic text-3xl transform -rotate-1 text-gray-400">
             yours truly, <br/>
             <span className="text-yellow-400 text-4xl">a teenage dirtbag</span>
           </p>
           <p className="font-typewriter text-sm opacity-40 mt-4">
             © 2011 ~ forever
           </p>
         </div>
      </footer>
    </div>
  );
}
