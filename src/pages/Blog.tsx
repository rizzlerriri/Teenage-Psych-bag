import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { format } from 'date-fns';
import { formatFirestoreTime } from '../lib/utils';
import RansomTitle from '../components/RansomTitle';
import { Search } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  mood: string;
  readTime: string;
  publishedAt: any;
  content?: string;
}

const CATEGORIES = ['All', 'Self Expression', 'Psychology', 'Life', 'Art', 'Cinema', 'Growing Up', 'Internet Culture', 'Overthinking', 'Identity'];

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'All';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let q = query(
      collection(db, 'posts'),
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc')
    );

    if (categoryFilter !== 'All') {
      q = query(
        collection(db, 'posts'),
        where('isPublished', '==', true),
        where('category', '==', categoryFilter),
        orderBy('publishedAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryFilter]);

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      (post.content && post.content.toLowerCase().includes(query)) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12 relative">
         <h1 className="font-editors-note italic text-yellow-400 text-4xl md:text-6xl drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">The Diary</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, excerpt, or content..."
          className="w-full pl-12 pr-4 py-3 font-typewriter border border-white/20 focus:outline-none focus:border-yellow-400 transition-colors bg-black/40 backdrop-blur-sm text-yellow-100 placeholder-white/30"
        />
      </div>

      {/* Filters */}
      <div className="mb-16 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
            className={`font-typewriter text-sm px-4 py-2 border transition-all ${
              categoryFilter === cat 
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' 
                : 'bg-black/40 text-gray-300 border-white/20 hover:border-yellow-400 hover:text-yellow-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-12">
        {loading ? (
          <div className="text-center font-typewriter text-xl text-yellow-400 opacity-60">Loading chaos...</div>
        ) : posts.length === 0 ? (
          <div className="bg-[#fef08a] text-black shadow-xl p-10 text-center font-caveat text-2xl rotate-1">
            Nothing to see here yet. Come back when I'm having a breakdown.
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-[#fbcfe8] text-black shadow-xl p-10 text-center font-caveat text-2xl -rotate-1">
            No thoughts match '{searchQuery}'.
          </div>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`group p-8 hover:-translate-y-1 transition-transform relative cursor-pointer block shadow-xl ${['bg-[#fef08a]', 'bg-[#fbcfe8]', 'bg-[#bae6fd]', 'bg-[#a7f3d0]'][i % 4]} text-black`}
              style={{ transform: `rotate(${i % 2 === 0 ? '-1deg' : '1.5deg'})` }}
            >
               <Link to={`/blog/${post.id}`} className="block absolute inset-0 z-10" />
               <div className="relative z-0 pl-2">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-4 gap-2">
                   <h2 className="font-caveat font-bold text-3xl md:text-4xl group-hover:text-red-700 transition-colors leading-tight">
                     {post.title}
                   </h2>
                   <div className="font-typewriter text-xs sm:text-sm flex gap-3 text-gray-500 whitespace-nowrap opacity-70">
                     <span>{post.publishedAt ? format(formatFirestoreTime(post.publishedAt), 'MMM dd, yyyy') : 'Recently'}</span>
                     <span>·</span>
                     <span>{post.readTime}</span>
                   </div>
                 </div>

                 <p className="font-caveat text-xl sm:text-2xl text-gray-800 leading-relaxed mb-6 opacity-90">
                   {post.excerpt}
                 </p>

                 <div className="flex justify-between items-center mt-6 border-t border-black/10 pt-4">
                   <div className="flex flex-wrap gap-2 items-center z-20">
                     <span className="font-typewriter text-xs uppercase tracking-wider bg-black text-white px-2 py-1">
                       {post.category}
                     </span>
                     {post.mood && (
                       <span className="font-typewriter text-xs opacity-70 bg-black/5 px-2 py-1 rounded ml-2">
                         mood: {post.mood}
                       </span>
                     )}
                   </div>
                   <span className="inline-block font-editors-note italic text-xl text-black border-2 border-black px-6 py-2 group-hover:bg-black group-hover:text-yellow-400 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                     Read More &rarr;
                   </span>
                 </div>
               </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
