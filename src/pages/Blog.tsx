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
      <div className="text-center mb-8">
         <RansomTitle text="The Diary" size="lg" className="mb-4" />
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
          className="w-full pl-12 pr-4 py-3 font-typewriter border-2 border-black focus:outline-none focus:ring-2 focus:ring-electric-blue transition-shadow shadow-[4px_4px_0_0_#000] focus:shadow-none bg-white"
        />
      </div>

      {/* Filters */}
      <div className="mb-12 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
            className={`font-typewriter text-sm px-4 py-2 border-2 border-black transition-all transform shadow-[2px_2px_0_0_#000] ${
              categoryFilter === cat 
                ? 'bg-black text-white translate-y-1 shadow-none' 
                : 'bg-white hover:bg-chalk-yellow hover:-translate-y-1'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-12">
        {loading ? (
          <div className="text-center font-typewriter text-xl">Loading chaos...</div>
        ) : posts.length === 0 ? (
          <div className="text-center font-kalam text-2xl text-gray-500 bg-white p-10 border border-dashed border-gray-400 transform rotate-1">
            Nothing to see here yet. Come back when I'm having a breakdown.
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center font-kalam text-2xl text-gray-500 bg-white p-10 border border-dashed border-gray-400 transform rotate-1">
            No thoughts match '{searchQuery}'.
          </div>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-[#fdfbf7] p-6 md:p-8 border-t border-black/20"
            >
               {/* Decorative tape */}
               <div className="absolute top-0 right-10 w-16 h-6 bg-red-200/50 mask-tape rotate-6" />

               <div className="flex flex-col md:flex-row gap-4 items-start md:items-baseline mb-4">
                 <Link to={`/blog/${post.id}`} className="flex-grow">
                   <h2 className="font-sans font-bold text-3xl group-hover:text-crayon-red transition-colors decoration-2 decoration-wavy group-hover:underline underline-offset-4">
                     {post.title}
                   </h2>
                 </Link>
                 <div className="font-typewriter text-sm flex gap-3 text-gray-500 whitespace-nowrap">
                   <span>{post.publishedAt ? format(formatFirestoreTime(post.publishedAt), 'MMM dd, yyyy') : 'Recently'}</span>
                   <span>·</span>
                   <span>{post.readTime}</span>
                 </div>
               </div>

               <p className="font-serif text-xl text-gray-800 leading-relaxed mb-6">
                 {post.excerpt}
               </p>

               <div className="flex flex-wrap gap-2 items-center">
                 <span className="font-typewriter text-xs uppercase tracking-wider bg-black text-white px-2 py-1">
                   {post.category}
                 </span>
                 {post.mood && (
                   <span className="font-caveat text-xl text-purple-pen ml-2">
                     mood: {post.mood}
                   </span>
                 )}
               </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
