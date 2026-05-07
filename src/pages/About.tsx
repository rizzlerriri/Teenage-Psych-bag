import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import RansomTitle from '../components/RansomTitle';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function About() {
  const containerRef = useRef(null);
  const [aboutContent, setAboutContent] = useState<string | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'about_me'));
        if (docSnap.exists() && docSnap.data().content) {
          setAboutContent(docSnap.data().content);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'settings/about_me');
      }
    };
    fetchAbout();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 relative" ref={containerRef}>
      <div className="text-center mb-16">
        <RansomTitle text="Who am I?" size="lg" className="mb-4" />
        <p className="font-typewriter">(or rather, who aren't I?)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Avatar polaroid */}
        <div className="md:col-span-5 relative">
          <motion.div 
            style={{ y: parallaxY }}
            initial={{ rotate: -5, opacity: 0 }}
            animate={{ rotate: -2, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="bg-white p-4 pb-16 shadow-xl border border-gray-200 sticky top-24 z-10"
          >
            {/* Fake tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/50 mask-tape rotate-2" />
            
            <div className="bg-gray-800 aspect-[3/4] w-full flex items-center justify-center relative overflow-hidden group">
              {/* Silhouette / shadow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray-700" />
              <div className="w-3/4 h-3/4 rounded-full bg-black blur-xl opacity-80 group-hover:blur-2xl transition-all duration-1000" />
              <p className="relative z-10 font-marker text-white/20 text-4xl rotate-45">REDACTED</p>
            </div>
            
            <p className="absolute bottom-4 left-0 right-0 text-center font-marker text-xl text-black/80">psych nerd '11</p>
          </motion.div>
          
          <img src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=400&q=80" alt="texture" className="hidden" /> {/* Just preloading a texture if needed, not actually using */}
        </div>

        {/* Text sections */}
        <div className="md:col-span-7 space-y-12 bg-[#faf9f5] p-8 md:p-12 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] border-2 border-black/5 relative">
          
          <div className="absolute -left-6 top-20 w-12 h-12 rounded-full border-4 border-crayon-red opacity-50 z-0" />
          <div className="absolute -right-4 bottom-40 w-16 h-16 rounded-full border-2 border-dashed border-electric-blue opacity-50 z-0" />

          {aboutContent ? (
            <div className="relative z-10 prose prose-lg prose-headings:font-kalam prose-headings:text-3xl prose-headings:text-purple-pen prose-h2:border-b-2 prose-h2:border-bubblegum prose-h2:inline-block prose-h2:border-dashed prose-p:font-kalam prose-p:text-xl prose-p:text-gray-800 prose-p:leading-relaxed prose-li:font-kalam prose-li:text-xl prose-li:text-gray-800 max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{aboutContent}</Markdown>
            </div>
          ) : (
            <>
              <section className="relative z-10">
                <h2 className="font-kalam font-bold text-3xl mb-4 text-purple-pen border-b-2 border-bubblegum inline-block border-dashed">why this blog exists</h2>
                <div className="font-sans text-lg leading-relaxed text-gray-800 space-y-4">
                  <p>
                    I was born in 2011. The iPad generation. The social media experimental subjects.
                    But I don't fit the mold. I hate TikTok dances, I overanalyze group chats, and I read Carl Jung at 2 AM while listening to early 2000s pop punk.
                  </p>
                  <p>
                    This blog is a rebellion against the curated, polished aesthetic of my generation's internet. It's rough, it's messy, and it's honest.
                  </p>
                </div>
              </section>

              <section className="relative z-10">
                <h2 className="font-kalam font-bold text-3xl mb-4 text-electric-blue border-b-2 border-chalk-yellow inline-block">why "teenage psychbag"?</h2>
                <div className="font-sans text-lg leading-relaxed text-gray-800 space-y-4">
                  <p>
                    Half "psychology nerd", half "teenage dirtbag". I'm trying to figure out how the human mind works, while my own mind is an absolute chaotic mess.
                  </p>
                  <p>
                    I write about identity, loneliness, art, overstimulation, and whatever else keeps me awake.
                  </p>
                </div>
              </section>
            </>
          )}

          <section className="relative z-10 text-center pt-8 border-t border-gray-300 border-dashed">
             <p className="font-typewriter bg-black text-white inline-block px-4 py-2 transform rotate-1 shadow-md">
               "i read minds but i can't read the room"
             </p>
          </section>
        </div>
      </div>
    </div>
  );
}
