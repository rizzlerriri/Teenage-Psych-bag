import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';
import { Post, Category } from '../types';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, ExternalLink, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [quote, setQuote] = useState('');
  const navigate = useNavigate();

  const quotes = [
    "The brain is a messy room where we store our best secrets.",
    "Rage is just an emotion that's lost its way home.",
    "Identity is a mask that's been glued on too tight.",
    "We all have shadows; the question is, do you let yours lead?",
    "Every mind is a labyrinth—don't get lost in your own."
  ];

  useEffect(() => {
    if (!api.getToken()) {
      navigate('/login');
      return;
    }
    loadPosts();
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      if (editingPost.id) {
        await api.updatePost(editingPost.id, editingPost);
      } else {
        await api.createPost(editingPost);
      }
      setIsFormOpen(false);
      setEditingPost(null);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to tear this page out? Forever?')) {
      await api.deletePost(id);
      loadPosts();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setEditingPost(prev => ({ ...prev, featuredImage: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const categories: Category[] = ['Emotions', 'Identity', 'Rage', 'Society', 'Mind Games'];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-handwritten underline decoration-rage decoration-4">The Command Center</h1>
          <p className="font-marker opacity-60 flex items-center gap-2">
            <Lightbulb size={16} /> {quote}
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingPost({ category: 'Emotions', title: '', content: '', tags: '' });
            setIsFormOpen(true);
          }}
          className="btn-scribble flex items-center gap-2 text-xl"
        >
          <Plus size={20} /> New Fragment
        </button>
      </header>

      {/* Stats / Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="scribble-box bg-white p-6 flex flex-col items-center">
           <span className="text-4xl font-handwritten">{posts.length}</span>
           <span className="font-marker text-sm opacity-50 uppercase tracking-widest">Entries Recorded</span>
        </div>
        <div className="scribble-box bg-white p-6 rotate-1 flex flex-col items-center">
           <span className="text-4xl font-handwritten">{new Set(posts.map(p => p.category)).size}</span>
           <span className="font-marker text-sm opacity-50 uppercase tracking-widest">Active Categories</span>
        </div>
        <div className="scribble-box bg-white p-6 -rotate-1 flex flex-col items-center">
           <span className="text-4xl font-handwritten">{posts.reduce((sum, p) => sum + p.content.split(' ').length, 0)}</span>
           <span className="font-marker text-sm opacity-50 uppercase tracking-widest">Total Words Spilled</span>
        </div>
      </div>

      {/* Post List */}
      <section className="bg-white/40 border-2 border-ink rounded-lg overflow-hidden shadow-xl">
        <div className="p-4 bg-ink text-paper font-marker flex justify-between items-center">
           <span>Existing Entry Index</span>
           <span className="text-xs opacity-50">Manage with care</span>
        </div>
        <div className="divide-y-2 divide-ink/10">
          {loading ? (
            <div className="p-12 text-center font-marker animate-pulse">Scanning pages...</div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="p-6 flex items-center justify-between hover:bg-white/60 transition-colors group">
                <div className="flex gap-6 items-center">
                  <div className="w-12 h-12 bg-paper border border-ink flex items-center justify-center font-handwritten text-xl -rotate-6">
                    {post.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-handwritten text-2xl group-hover:underline">{post.title}</h4>
                    <div className="flex gap-4 items-center text-xs font-marker opacity-50">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setEditingPost(post);
                      setIsFormOpen(true);
                    }}
                    className="p-2 hover:bg-identity rounded-full hover:text-white transition-all shadow-sm"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-2 hover:bg-rage rounded-full hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                  <a href={`/post/${post.id}`} target="_blank" className="p-2 hover:bg-ink rounded-full hover:text-white transition-all shadow-sm">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center font-marker text-xl opacity-40">No records found. The ink is empty.</div>
          )}
        </div>
      </section>

      {/* Post Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-ink/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-4xl bg-paper border-4 border-ink shadow-[20px_20px_0px_rgba(0,0,0,1)] max-h-screen overflow-y-auto"
            >
              <form onSubmit={handleSave} className="p-8 md:p-12 space-y-8 relative">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-ink hover:text-white rounded-full transition-all"
                >
                  <X />
                </button>

                <div className="space-y-4">
                  <h2 className="text-4xl font-handwritten italic underline">
                    {editingPost?.id ? 'Revising History...' : 'Starting a New Confession...'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block font-marker">What's the title?</label>
                    <input 
                      type="text"
                      value={editingPost?.title}
                      onChange={(e) => setEditingPost(prev => ({ ...prev!, title: e.target.value }))}
                      className="w-full bg-white border-2 border-ink p-4 font-typewriter focus:outline-none"
                      placeholder="Give it a name..."
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block font-marker">Under which category?</label>
                    <select 
                      value={editingPost?.category}
                      onChange={(e) => setEditingPost(prev => ({ ...prev!, category: e.target.value as Category }))}
                      className="w-full bg-white border-2 border-ink p-4 font-marker focus:outline-none"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="block font-marker">Featured Memory (Image)</label>
                   <div className="flex gap-4 items-center">
                     <div className="relative">
                        <input 
                          type="file" 
                          onChange={handleImageUpload}
                          className="hidden" 
                          id="image-upload" 
                          accept="image/*"
                        />
                        <label 
                          htmlFor="image-upload" 
                          className="btn-scribble flex items-center gap-2 cursor-pointer bg-white"
                        >
                          <ImageIcon size={18} /> {uploading ? 'Capturing...' : 'Choose File'}
                        </label>
                     </div>
                     {editingPost?.featuredImage && (
                       <div className="w-16 h-16 border-2 border-ink rounded overflow-hidden">
                          <img src={editingPost.featuredImage} className="w-full h-full object-cover" />
                       </div>
                     )}
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="block font-marker">Spill your thoughts (Markdown supported)</label>
                  <textarea 
                    value={editingPost?.content}
                    onChange={(e) => setEditingPost(prev => ({ ...prev!, content: e.target.value }))}
                    className="w-full h-64 bg-white border-2 border-ink p-6 font-typewriter focus:outline-none resize-none"
                    placeholder="Write like nobody's watching..."
                    required
                  ></textarea>
                </div>

                <div className="space-y-4">
                    <label className="block font-marker">Tags (separated by commas)</label>
                    <input 
                      type="text"
                      value={editingPost?.tags}
                      onChange={(e) => setEditingPost(prev => ({ ...prev!, tags: e.target.value }))}
                      className="w-full bg-white border-2 border-ink p-4 font-typewriter focus:outline-none"
                      placeholder="e.g. moody, night thought, chaos"
                    />
                  </div>

                <div className="pt-8 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-ink text-paper py-4 text-2xl font-handwritten hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Save size={24} /> {editingPost?.id ? 'UPDATE ENTRY' : 'COMMITT TO MEMORY'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
