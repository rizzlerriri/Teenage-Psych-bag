
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Post, Category } from '../types';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | ''>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPosts();
  }, [category]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts(category, search);
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories: Category[] = ['Emotions', 'Identity', 'Rage', 'Society', 'Mind Games'];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-2xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative inline-block"
        >
          <span className="absolute -top-4 -right-4 bg-rage text-white px-2 py-1 rotate-12 font-marker text-sm">RAW</span>
          <h2 className="text-5xl md:text-7xl font-handwritten leading-tight">
            My head is a <br />
            <span className="italic underline decoration-rage decoration-4">Beautiful Disaster.</span>
          </h2>
        </motion.div>
        <p className="font-typewriter text-lg opacity-80">
          A digital scrapbook recording the tremors of teenage psychology. 
          Rage, self-discovery, and the mind games we play to survive.
        </p>
      </section>

      {/* Filter / Search Bar */}
      <section className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/50 p-4 border-2 border-ink rounded-lg scribble-box">
        <div className="flex flex-wrap gap-2 justify-center">
          <button 
            onClick={() => setCategory('')}
            className={`px-4 py-1 rounded-full font-marker border-2 border-ink ${!category ? 'bg-ink text-white' : 'hover:bg-ink hover:text-white'} transition-colors`}
          >
            Everything
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1 rounded-full font-marker border-2 border-ink ${category === cat ? 'bg-ink text-white' : 'hover:bg-ink hover:text-white'} transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search my thoughts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadPosts()}
            className="w-full bg-transparent border-b-2 border-ink py-2 px-8 font-typewriter focus:outline-none"
          />
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 opacity-50" size={18} />
        </div>
      </section>

      {/* Post Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {loading ? (
          <div className="col-span-full text-center py-20 font-marker text-2xl animate-pulse">
            Searching for words...
          </div>
        ) : posts.length > 0 ? (
          posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, rotate: idx % 2 === 0 ? -2 : 2 }}
              animate={{ opacity: 1, rotate: idx % 2 === 0 ? -2 : 2 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="relative"
            >
              <Link to={`/post/${post.id}`} className="block group">
                {/* Scrapbook Frame */}
                <div className="bg-white p-4 shadow-xl border border-gray-100 relative">
                  {/* Tape decoration */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-200/40 rotate-1 mix-blend-multiply border border-yellow-300"></div>
                  
                  {post.featuredImage && (
                    <div className="aspect-[4/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                      <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="mt-6 space-y-4">
                    <span className="text-xs font-marker uppercase tracking-widest bg-ink text-paper px-2 py-1">
                      {post.category}
                    </span>
                    <h3 className="text-2xl font-handwritten leading-none">{post.title}</h3>
                    <p className="font-typewriter text-sm line-clamp-3 opacity-70">
                      {post.excerpt}
                    </p>
                    <div className="pt-4 flex justify-between items-center text-xs font-marker italic border-t border-dashed border-gray-200">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Read entry <Sparkles size={12}/></span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 font-marker text-2xl opacity-50">
            It's empty here. Just the wind.
          </div>
        )}
      </section>
    </div>
  );
}
