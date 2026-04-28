
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Post } from '../types';
import { api } from '../lib/api';
import { ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await api.getPost(id!);
      setPost(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center font-marker text-2xl py-40">Unlocking the diary...</div>;
  if (!post) return <div className="text-center font-marker text-2xl py-40">Entry was torn out. (Not found)</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center gap-2 font-marker mb-12 hover:underline">
        <ArrowLeft size={18} /> Back to the collection
      </Link>

      <article className="notebook-page relative">
        <div className="notebook-margin"></div>
        
        {/* Post Metadata in the 'margin' or top */}
        <div className="relative z-10 pl-8 space-y-8">
          <header className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="bg-ink text-paper px-3 py-1 font-marker text-sm rotate-2">
                {post.category}
              </span>
              <div className="font-typewriter text-xs opacity-50">
                DATE: {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-handwritten highlight-yellow py-2">
              {post.title}
            </h1>
          </header>

          {post.featuredImage && (
             <div className="relative group">
                <div className="absolute inset-0 bg-ink/10 -rotate-1 group-hover:rotate-0 transition-transform"></div>
                <img src={post.featuredImage} alt={post.title} className="relative z-10 w-full h-[400px] object-cover border-4 border-white shadow-lg" />
             </div>
          )}

          <div className=" prose prose-stone max-w-none font-typewriter leading-relaxed text-lg">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <footer className="pt-12 mt-12 border-t border-ink border-opacity-10 font-marker flex flex-wrap gap-8 items-center text-sm">
            <div className="flex gap-2 items-center">
               <Heart size={20} className="text-rage cursor-pointer hover:fill-rage" /> {Math.floor(Math.random() * 50) + 12}
            </div>
            <div className="flex gap-2 items-center">
               <MessageCircle size={20} /> Discuss
            </div>
            <div className="flex gap-2 items-center cursor-pointer">
               <Share2 size={18} /> Share fragment
            </div>
            
            <div className="ml-auto opacity-40">
               #{post.tags}
            </div>
          </footer>
        </div>

        {/* Scattered notes decoration */}
        <div className="hidden lg:block absolute -right-20 top-40 w-48 p-4 bg-yellow-100/80 shadow-md rotate-6 border border-yellow-200 font-handwritten text-sm">
          <p>"Don't forget: emotions aren't facts. They just feel like them."</p>
          <div className="mt-2 text-xs opacity-50 underline">Personal Note</div>
        </div>
      </article>

      {/* Rough Pagination */}
      <div className="mt-12 flex justify-between font-marker">
        <div className="opacity-40 hover:opacity-100 cursor-pointer">&larr; Older shadows</div>
        <div className="opacity-40 hover:opacity-100 cursor-pointer">Newer dreams &rarr;</div>
      </div>
    </motion.div>
  );
}
