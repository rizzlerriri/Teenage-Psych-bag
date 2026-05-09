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
      <div className="text-center mb-16 relative">
        <h1 className="font-editors-note italic text-yellow-400 text-4xl md:text-6xl drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">Who am I?</h1>
        <p className="font-typewriter text-gray-400 mt-4">(or rather, who aren't I?)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Avatar polaroid */}
        <div className="md:col-span-5 relative">
          <motion.div 
            style={{ y: parallaxY }}
            initial={{ rotate: -3, opacity: 0 }}
            animate={{ rotate: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="bg-[#fef9c3] p-4 pb-16 shadow-[4px_4px_20px_rgba(0,0,0,0.6)] sticky top-24 z-10 mx-auto max-w-[300px]"
          >
            {/* Fake tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 mask-tape backdrop-blur-sm transform rotate-2" />
            
            <div className="bg-gray-800 aspect-[3/4] w-full flex items-center justify-center relative overflow-hidden group">
              {/* Silhouette / shadow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-black" />
              <div className="w-3/4 h-3/4 rounded-full bg-black blur-xl opacity-90 group-hover:blur-3xl transition-all duration-1000" />
              <p className="relative z-10 font-sans font-bold tracking-widest text-white/30 text-3xl rotate-45">REDACTED</p>
            </div>
            
            <p className="absolute bottom-4 left-0 right-0 text-center font-caveat text-3xl text-black/80">psych nerd '11</p>
          </motion.div>
        </div>

        {/* Text sections */}
        <div className="md:col-span-7 space-y-12 diary-page p-8 md:p-12 shadow-[4px_4px_20px_rgba(0,0,0,0.6)] relative mt-8 md:mt-0">
          
          <div className="absolute -left-6 top-20 w-12 h-12 rounded-full border-2 border-red-500 opacity-30 z-0" />
          <div className="absolute -right-4 bottom-40 w-16 h-16 rounded-full border border-blue-500 opacity-30 z-0" />

          {aboutContent ? (
            <div className="relative z-10 prose prose-lg prose-headings:font-caveat prose-headings:text-4xl prose-headings:text-black prose-p:font-caveat prose-p:text-2xl prose-p:text-gray-900 prose-p:leading-[2.3rem] prose-li:font-caveat prose-li:text-2xl prose-li:leading-[2.3rem] prose-li:text-gray-900 max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{aboutContent}</Markdown>
            </div>
          ) : (
            <>
              <section className="relative z-10">
                <h2 className="font-caveat font-bold text-4xl mb-4 text-black border-b border-black/20 pb-2 inline-block">why this blog exists</h2>
                <div className="font-caveat text-2xl leading-[2.3rem] text-gray-900 space-y-4">
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
                <h2 className="font-caveat font-bold text-4xl mb-4 text-black border-b border-black/20 pb-2 inline-block">why "teenage psychbag"?</h2>
                <div className="font-caveat text-2xl leading-[2.3rem] text-gray-900 space-y-4">
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

          <section className="relative z-10 text-center pt-8 border-t border-black/10">
             <p className="font-typewriter bg-black/5 text-black inline-block px-4 py-2 transform rotate-1 border border-black/10">
               "i read minds but i can't read the room"
             </p>
          </section>
        </div>
      </div>
    </div>
  );
}
