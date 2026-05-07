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
      <section className="text-center py-10 md:py-20 relative">
        <RansomTitle text={"Teenage Psych\nbag"} size="xl" className="mb-6" />
        <div className="relative inline-block">
          <h2 className="font-typewriter text-xl md:text-2xl mt-4 px-4 py-2 bg-black text-white transform -rotate-1 inline-block shadow-[4px_4px_0_0_#ff3333]">
            Diary of a psychology nerd who's a dirtbag
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute -bottom-4 left-0 h-2 bg-gradient-to-r from-crayon-red via-electric-blue to-chalk-yellow opacity-80"
          />
        </div>
        <p className="mt-8 font-kalam text-xl md:text-2xl text-gray-700 max-w-lg mx-auto">
          "for people who think too much and belong nowhere"
        </p>
      </section>

      {/* Grid Layout for content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Latest Diary Entries */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-end gap-4 border-b-2 border-black pb-2 mb-6">
            <h3 className="font-marker text-3xl md:text-4xl text-purple-pen">Latest Brain Dumps</h3>
            <span className="font-typewriter text-sm mb-1 opacity-70">&gt;&gt; read at your own risk</span>
          </div>

          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center font-typewriter p-10 bg-white border border-dashed border-gray-400 rotate-1">
                No recent brain dumps. It's suspiciously quiet...
              </div>
            ) : posts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="group relative bg-white p-6 shadow-md border-l-4 border-l-crayon-red transform transition-transform hover:-translate-y-1 hover:rotate-1"
              >
                {/* Notebook holes */}
                <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around py-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-3 h-3 rounded-full bg-paper border border-gray-300 shadow-inner" />
                  ))}
                </div>
                
                <div className="pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/blog/${post.id}`}>
                      <h4 className="font-sans font-bold text-2xl group-hover:text-electric-blue transition-colors">{post.title}</h4>
                    </Link>
                    <span className="font-typewriter text-xs bg-gray-100 px-2 py-1 rotate-2 border border-dashed border-gray-400">{post.publishedAt ? format(formatFirestoreTime(post.publishedAt), 'MMM dd, yyyy') : 'Recently'}</span>
                  </div>
                  <p className="font-serif text-lg text-gray-700 leading-relaxed mb-4">{post.excerpt}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-caveat text-xl text-messy-green">Mood: {post.mood}</span>
                    <Link to={`/blog/${post.id}`} className="font-marker underline decoration-wavy decoration-bubblegum text-lg">
                      read more -&gt;
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/blog" className="inline-block font-typewriter text-lg border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_0_#bb00ff]">
               SEE ALL ENTRIES
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Quote of the day (Note card) */}
          <div className="relative bg-[#fffdf0] p-6 shadow-lg border border-gray-200 transform rotate-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-500 shadow-md flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-red-800 shadow-inner" />
            </div>
            <h3 className="font-marker text-xl mb-4 text-center mt-2">Quote of the Day</h3>
            <p className="font-kalam text-xl leading-relaxed text-center">
              "{quote?.text || 'We are all in the gutter, but some of us are looking at the stars.'}"
            </p>
            <p className="text-right font-typewriter text-sm mt-4 opacity-70">- {quote?.author || 'Oscar Wilde / Me'}</p>
          </div>

          {/* Random Thoughts Wall (Sticky notes) */}
          <div className="bg-kraft p-6 rounded-sm shadow-inner relative overflow-hidden">
            <h3 className="font-marker text-white text-2xl mb-6 relative z-10">Random Thoughts Wall</h3>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-chalk-yellow p-4 shadow-md transform -rotate-3 text-sm font-caveat text-xl">
                I wonder if my dog thinks I'm his pet.
              </div>
              <div className="bg-bubblegum p-4 shadow-md transform rotate-6 text-sm font-caveat text-xl">
                why is nostalgia so painful
              </div>
              <div className="col-span-2 bg-blue-200 p-4 shadow-md transform -rotate-1 text-sm font-caveat text-xl">
                i diagnose everyone I meet within 5 minutes.
              </div>
            </div>
          </div>

          {/* Explore Categories */}
          <div>
            <h3 className="font-marker text-2xl border-b-2 border-black pb-2 mb-4 text-orange-pastel drop-shadow-md">Explore the Chaos</h3>
            <ul className="flex flex-wrap gap-2">
              {['Psychology', 'Life', 'Art', 'Cinema', 'Identity', 'Growing Up'].map((cat, i) => (
                <li key={cat}>
                  <Link to={`/blog?category=${cat}`} className="font-typewriter text-sm bg-white border border-black px-2 py-1 transform hover:-translate-y-1 hover:bg-black hover:text-white transition-all inline-block shadow-[2px_2px_0_0_rgba(0,0,0,1)]" style={{ transform: `rotate(${i % 2 === 0 ? '-2deg' : '2deg'})`}}>
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
