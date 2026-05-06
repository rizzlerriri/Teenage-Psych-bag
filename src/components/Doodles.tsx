import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DOODLES = [
  "M50 0 L60 35 L95 35 L68 57 L78 95 L50 72 L22 95 L32 57 L5 35 L40 35 Z", // star
  "M50 80 Q20 50 20 30 A 15 15 0 0 1 50 30 A 15 15 0 0 1 80 30 Q80 50 50 80 Z", // heart
  "M50 50 m0 -40 a40 40 0 1 1 -5 0 a35 35 0 1 1 5 0 a30 30 0 1 1 -5 0 a25 25 0 1 1 5 0", // spiral
  "M20 50 L80 50 M60 30 L80 50 L60 70", // arrow
  "M10 50 L30 20 L50 80 L70 20 L90 50", // zig zag
  "M 50, 10 C 80, 10 90, 40 85, 70 C 80, 95 30, 95 15, 65 C 5, 40 20, 15 50, 10 C 70, 5 95, 30 90, 60", // messy circle
  "M20 20 Q50 50 80 20 T20 80 T80 80", // squiggles
  "M10 10 L90 90 M10 90 L90 10" // X mark
];

const COLORS = ['#ff3333', '#0044ff', '#00cc44', '#bb00ff', '#ff66b3', '#ffaa66'];

export default function Doodles() {
  const [doodleItems, setDoodleItems] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Repopulate doodles when route changes to feel "messy"
    const numDoodles = Math.floor(Math.random() * 6) + 6; // 6-11 doodles
    const newDoodles = [];
    for (let i = 0; i < numDoodles; i++) {
        newDoodles.push({
            id: `${location.pathname}-${i}`,
            pathData: DOODLES[Math.floor(Math.random() * DOODLES.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            size: Math.random() * 60 + 40, // 40-100px
            rotate: Math.random() * 360,
        });
    }
    setDoodleItems(newDoodles);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      {doodleItems.map((doodle) => (
        <svg 
            key={doodle.id}
            className="absolute drop-shadow-sm"
            style={{ 
                top: doodle.top, 
                left: doodle.left, 
                width: doodle.size, 
                height: doodle.size,
                transform: `rotate(${doodle.rotate}deg)`
            }}
            viewBox="0 0 100 100" 
            fill="none" 
            stroke={doodle.color} 
            strokeWidth={Math.random() * 3 + 2} 
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <motion.path
                d={doodle.pathData}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ 
                    duration: Math.random() * 1.5 + 0.5, 
                    delay: Math.random() * 1,
                    ease: "easeOut"
                }}
            />
        </svg>
      ))}
    </div>
  );
}
