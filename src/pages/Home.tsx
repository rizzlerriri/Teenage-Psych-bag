import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import RansomTitle from '../components/RansomTitle';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { format } from 'date-fns';
import { formatFirestoreTime } from '../lib/utils';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  mood: string;
  publishedAt: any;
}


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [quote, setQuote] = useState<{text: string, author: string} | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const docRef = doc(db, 'settings', 'quote_of_the_day');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().text) {
          setQuote({ text: docSnap.data().text, author: docSnap.data().author });
        }
      } catch (err) {
        console.error('Error fetching quote of the day', err);
      }
    };
    fetchQuote();

    const q = query(
      collection(db, 'posts'),
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center py-10 md:py-20 flex flex-col items-center justify-center relative">
        <motion.div 
          initial={{ rotate: -5, opacity: 0 }}
          animate={{ rotate: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-[#fef9c3] p-8 shadow-xl relative inline-block w-full max-w-sm md:max-w-md mx-auto"
        >
          {/* Tape effect */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 mask-tape backdrop-blur-sm" />
          <div className="min-h-[100px] flex items-center justify-center">
             <img src="/teenage-psychbag-logo.png" alt="teenage psychbag logo" className="w-full h-auto mix-blend-multiply" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
             <div className="hidden">
               <RansomTitle text={"teenage\npsychbag"} size="xl" />
             </div>
          </div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-12 font-editors-note italic text-yellow-400 text-2xl md:text-3xl drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]"
        >
          A diary of a dirtbag who's discovering herself
        </motion.h2>
      </section>

      {/* Grid Layout for content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative pb-20">
        
        {/* Latest Diary Entries */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-end gap-4 border-b border-white/20 pb-4 mb-2">
            <h3 className="font-editors-note italic text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] text-3xl md:text-4xl">Latest Diary Entries</h3>
          </div>

          <div className="space-y-8">
            {posts.length === 0 ? (
              <div className="bg-[#fef08a] text-black shadow-xl p-10 text-center font-caveat text-2xl rotate-1">
                No recent diary entries. It's suspiciously quiet...
              </div>
            ) : posts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className={`group p-8 hover:-translate-y-1 transition-transform relative cursor-pointer shadow-xl ${['bg-[#fef08a]', 'bg-[#fbcfe8]', 'bg-[#bae6fd]', 'bg-[#a7f3d0]'][i % 4]} text-black`}
                style={{ transform: `rotate(${i % 2 === 0 ? '-1deg' : '1.5deg'})` }}
              >
                <Link to={`/blog/${post.id}`} className="block absolute inset-0 z-10" />
                <div className="relative z-0 pl-2">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-4 gap-2">
                    <h4 className="font-caveat font-bold text-3xl md:text-4xl group-hover:text-red-700 transition-colors leading-tight">{post.title}</h4>
                    <span className="font-typewriter text-xs sm:text-sm opacity-60 shrink-0">{post.publishedAt ? format(formatFirestoreTime(post.publishedAt), 'MMM dd, yyyy') : 'Recently'}</span>
                  </div>
                  <p className="font-caveat text-xl sm:text-2xl text-gray-800 leading-relaxed mb-6 opacity-90">{post.excerpt}</p>
                  
                  <div className="flex justify-between items-center mt-6 border-t border-black/10 pt-4">
                    <span className="font-typewriter text-xs opacity-70 bg-black/5 px-2 py-1 rounded">mood: {post.mood}</span>
                    <span className="font-caveat text-2xl text-red-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 cursor-pointer relative z-20">
                      read &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/blog" className="inline-block font-editors-note italic text-yellow-400 text-2xl border-2 border-yellow-400 px-8 py-4 hover:bg-yellow-400 hover:text-black transition-colors shadow-[0_0_15px_rgba(250,204,21,0.3)]">
               Read The Full Diary
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-12 pt-4">
          
          {/* Quote of the day (Note card) */}
          <div className="relative bg-[#fffdf0] text-black p-8 shadow-xl transform rotate-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-800 shadow-md flex items-center justify-center opacity-90">
               <div className="w-3 h-3 rounded-full bg-black/40 shadow-inner" />
            </div>
            <h3 className="font-caveat text-3xl mb-4 text-center mt-2 border-b border-black/10 pb-2">Quote of the Day</h3>
            <p className="font-caveat text-2xl leading-relaxed text-center opacity-90">
              "{quote?.text || 'We are all in the gutter, but some of us are looking at the stars.'}"
            </p>
            <p className="text-right font-typewriter text-sm mt-6 opacity-60">- {quote?.author || 'Oscar Wilde / Me'}</p>
          </div>

          {/* Random Thoughts Wall (Sticky notes) */}
          <div className="bg-transparent border border-white/10 p-6 rounded relative overflow-hidden backdrop-blur-sm">
            <h3 className="font-editors-note italic text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] text-3xl mb-6 relative z-10 text-center">Random Thoughts Wall</h3>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-[#fef08a] p-4 shadow-lg transform -rotate-3 text-sm font-caveat text-2xl text-black">
                I wonder if my dog thinks I'm his pet.
              </div>
              <div className="bg-[#fbcfe8] p-4 shadow-lg transform rotate-6 text-sm font-caveat text-2xl text-black">
                why is nostalgia so painful
              </div>
              <div className="col-span-2 bg-[#bae6fd] p-4 shadow-lg transform -rotate-1 text-sm font-caveat text-2xl text-black">
                i diagnose everyone I meet within 5 minutes.
              </div>
            </div>
          </div>

          {/* Explore Categories */}
          <div className="bg-black/40 border border-white/10 p-6 backdrop-blur-sm">
            <h3 className="font-editors-note italic text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] text-3xl mb-6 text-center">Explore</h3>
            <ul className="flex flex-wrap gap-3 justify-center">
              {['Psychology', 'Life', 'Art', 'Cinema', 'Identity', 'Growing Up'].map((cat, i) => (
                <li key={cat}>
                  <Link to={`/blog?category=${cat}`} className="font-typewriter text-sm text-gray-300 border border-white/20 px-3 py-1 hover:-translate-y-1 hover:bg-yellow-400 hover:text-black transition-all inline-block">
                    #{cat.toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
