import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useMemo } from 'react';

const fonts = [
  'font-sans',
  'font-marker',
  'font-typewriter',
  'font-caveat',
  'font-serif' // default tailwind serif
];

const bgColors = [
  'bg-white',
  'bg-chalk-yellow/80',
  'bg-bubblegum/40',
  'bg-crayon-red/20',
  'bg-transparent',
  'bg-black text-white',
  'bg-electric-blue/30 text-white'
];

interface RansomTitleProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function RansomTitle({ text, className, size = 'lg' }: RansomTitleProps) {
  const letters = text.split('');
  
  const styles = useMemo(() => {
    return letters.map(() => {
      const font = fonts[Math.floor(Math.random() * fonts.length)];
      const bg = bgColors[Math.floor(Math.random() * bgColors.length)];
      const rotate = Math.floor(Math.random() * 20) - 10; // -10 to 10 deg
      const scale = 0.9 + Math.random() * 0.3; // 0.9 to 1.2
      const isUpperCase = Math.random() > 0.5;
      const margin = Math.random() > 0.7 ? 'mx-1' : '-mx-0.5';
      
      return { font, bg, rotate, scale, isUpperCase, margin };
    });
  }, [text]);

  const sizeClass = {
    sm: 'text-xl sm:text-2xl p-1',
    md: 'text-3xl sm:text-4xl p-1.5',
    lg: 'text-5xl sm:text-6xl p-2 sm:p-3',
    xl: 'text-6xl sm:text-8xl p-3 sm:p-4'
  }[size];

  return (
    <div className={cn("flex flex-wrap items-center justify-center font-bold tracking-tighter leading-none", className)}>
      {letters.map((char, i) => {
        if (char === '\n') return <span key={i} className="basis-full h-0" />;
        if (char === ' ') return <span key={i} className="w-4 sm:w-8" />;
        
        const s = styles[i];
        
        return (
          <motion.span
            key={i}
            whileHover={{ scale: 1.1, rotate: s.rotate * -1 }}
            className={cn(
              "inline-block border border-black/20 shadow-sm relative",
              s.font,
              s.bg,
              s.margin,
              sizeClass
            )}
            style={{ 
              transform: `rotate(${s.rotate}deg) scale(${s.scale})`,
              zIndex: Math.floor(Math.random() * 10)
            }}
          >
            {/* Fake tape corner sometimes */}
            {Math.random() > 0.7 && (
              <span className="absolute -top-1 -left-1 w-4 h-2 bg-white/40 mask-tape rotate-45 z-10" />
            )}
            {char.toLowerCase()} {/* Random upper/lower? No, maybe just what was passed, or random. The prompt said "some letters black & white", "mixed sizes". Let's stick to what's passed but we can do some transform */}
          </motion.span>
        );
      })}
    </div>
  );
}
