import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import RansomTitle from './RansomTitle';
import Doodles from './Doodles';
import DisturbMyPeace from './DisturbMyPeace';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden font-sans scrapbook-texture selection:bg-chalk-yellow text-ink">
      <Doodles />
      
      <header className="relative z-10 pt-8 pb-4 px-4 border-b-2 border-black/10 bg-paper/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/">
            <RansomTitle text={"Teenage Psych\nbag"} size="sm" />
          </Link>
          
          <nav className="flex flex-wrap items-center justify-center gap-6 font-marker text-lg">
            <Link to="/about" className="relative group">
              <span className="hover:text-electric-blue transition-colors">about me</span>
              <motion.span className="absolute -bottom-1 left-0 w-full h-1 bg-crayon-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link to="/blog" className="relative group">
              <span className="hover:text-purple-pen transition-colors">the diary</span>
              <motion.span className="absolute -bottom-1 left-0 w-full h-1 bg-bubblegum origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
            <Link to="/secret" className="rotate-3 ml-4 bg-black text-white px-3 py-1 font-typewriter text-sm hover:rotate-6 hover:bg-crayon-red transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
              [admin]
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12 min-h-[70vh]">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      <DisturbMyPeace />

      <footer className="relative z-10 mt-20 pb-8 text-center border-t-2 border-black/10 pt-10 px-4">
         <div className="flex flex-col items-center justify-center gap-4">
           <div className="w-32 h-1 bg-crayon-red rounded-full" />
           <p className="font-caveat text-3xl transform -rotate-2">
             yours truly, <br/>
             <span className="text-purple-pen text-4xl">a teenage dirtbag</span>
           </p>
           <p className="font-typewriter text-sm opacity-60 mt-4">
             © 2011 ~ forever
           </p>
         </div>
      </footer>
    </div>
  );
}
