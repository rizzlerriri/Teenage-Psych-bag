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
  const [thought, setThought] = useState<string | null>(null);

  const handleClick = () => {
    let nextThought = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
    // Ensure we don't pick the same thought twice in a row, if possible
    while (nextThought === thought && THOUGHTS.length > 1) {
        nextThought = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
    }
    setThought(nextThought);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        setThought(null);
    }, 5000);
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 font-typewriter text-sm sm:text-base bg-electric-blue text-white px-4 py-2 rotate-2 hover:rotate-0 hover:bg-crayon-red hover:text-white transition-all shadow-[4px_4px_0_0_#bb00ff]"
      >
        [ DISTURB MY PEACE ]
      </button>

      <AnimatePresence>
        {thought && (
          <motion.div
            key={thought} // use thought as key to force re-render if another is clicked immediately
            initial={{ opacity: 0, y: 50, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: Math.random() * 10 - 5 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-chalk-yellow p-6 md:p-10 shadow-[8px_8px_0_0_rgba(0,0,0,1)] border-2 border-black max-w-sm w-[90%] md:w-full pointer-events-none"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-500 shadow-md flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-red-800 shadow-inner" />
            </div>
            <p className="font-kalam text-2xl text-center leading-relaxed mt-2 text-ink">{thought}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
