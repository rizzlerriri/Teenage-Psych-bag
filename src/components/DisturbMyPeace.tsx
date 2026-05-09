import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const THOUGHTS = [
  "I wonder if my dog thinks I'm his pet.",
  "why is nostalgia so painful",
  "i diagnose everyone I meet within 5 minutes.",
  "What if we are all just background characters in someone else's movie?",
  "I miss the days when the internet sounded like dial-up.",
  "Existential dread is my favorite aesthetic.",
  "I am overstimulated by my own thoughts.",
  "Maybe I'm the villain?",
  "I wish my brain had a mute button.",
  "Do you ever feel homesick for a place that doesn't exist?",
  "Everything is embarrassing.",
  "I'm a psychology nerd who needs therapy, how ironic.",
];

export default function DisturbMyPeace() {
  const [thought, setThought] = useState<{text: string, x: number, y: number, r: number} | null>(null);

  const handleClick = () => {
    let nextThought = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
    // Ensure we don't pick the same thought twice in a row, if possible
    while (thought && nextThought === thought.text && THOUGHTS.length > 1) {
        nextThought = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
    }
    
    // random positions (avoid edges roughly)
    const randomX = Math.floor(10 + Math.random() * 60);
    const randomY = Math.floor(10 + Math.random() * 60);
    const randomRot = Math.random() * 20 - 10;
    
    setThought({ text: nextThought, x: randomX, y: randomY, r: randomRot });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        setThought(null);
    }, 5000);
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 font-editors-note italic text-lg sm:text-xl bg-black/60 border border-white/20 backdrop-blur text-yellow-400 px-4 py-2 hover:bg-yellow-400 hover:text-black transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)]"
      >
        [ DISTURB MY PEACE ]
      </button>

      <AnimatePresence>
        {thought && (
          <motion.div
            key={thought.text}
            initial={{ opacity: 0, scale: 0.8, rotate: thought.r - 10 }}
            animate={{ opacity: 1, scale: 1, rotate: thought.r }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ top: `${thought.y}%`, left: `${thought.x}%` }}
            className="fixed z-50 bg-[#fef08a] p-6 shadow-[4px_4px_15px_rgba(0,0,0,0.5)] max-w-xs w-64 pointer-events-none"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-800 shadow-md flex items-center justify-center opacity-90">
              <div className="w-3 h-3 rounded-full bg-black/40 shadow-inner" />
            </div>
            <p className="font-caveat text-2xl text-center leading-relaxed mt-2 text-black">{thought.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
