import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import RansomTitle from '../components/RansomTitle';
import { formatFirestoreTime } from '../lib/utils';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  mood: string;
  readTime: string;
  publishedAt: any;
}

interface Comment {
  id: string;
  content: string;
  authorAlias: string;
  createdAt: any;
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [alias, setAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          setPost(null);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `posts/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    const q = query(
      collection(db, 'comments'),
      where('postId', '==', id),
      where('deleted', '==', false),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'comments');
    });

    return () => unsubscribe();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId: id,
        content: commentText.trim(),
        authorAlias: alias.trim() || 'Anonymous Reader',
        createdAt: serverTimestamp(),
        deleted: false
      });
      setCommentText('');
      setAlias('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'comments');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
     return <div className="text-center font-typewriter text-xl py-20">Reading my diary...</div>;
  }

  if (!post) {
     return (
       <div className="text-center py-20 bg-white border border-dashed border-gray-400 p-10 transform -rotate-2 max-w-lg mx-auto">
         <h2 className="font-marker text-4xl text-crayon-red mb-4">404: Post missing</h2>
         <p className="font-kalam text-xl">I probably deleted this because it was too embarrassing.</p>
         <div className="mt-8">
           <Link to="/blog" className="font-typewriter border-b-2 border-black hover:text-electric-blue transition-colors">Go back -&gt;&gt;</Link>
         </div>
       </div>
     );
  }

  return (
    <article className="max-w-3xl mx-auto py-10">
      <Link to="/blog" className="inline-block font-typewriter text-sm mb-8 hover:text-crayon-red transition-colors">
        &larr; back to all rants
      </Link>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-8 md:p-12 shadow-[12px_12px_0_0_rgba(0,0,0,0.1)] border-2 border-black relative"
      >
        {/* Notebook bindings */}
        <div className="absolute left-0 top-0 bottom-0 w-8 border-r-2 border-red-300 md:flex flex-col justify-evenly items-center hidden">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="w-4 h-4 rounded-full bg-paper border border-black shadow-inner relative left-[-8px]">
               <div className="absolute top-1/2 left-0 w-16 h-0.5 bg-black/40 rotate-[10deg] -translate-y-1/2 -z-10" />
             </div>
          ))}
        </div>

        <div className="md:pl-10">
          <header className="mb-10 text-center relative">
             <h1 className="font-marker text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-6 transform -rotate-1">
               {post.title}
             </h1>
             
             <div className="flex flex-wrap justify-center gap-4 font-typewriter text-sm opacity-80 border-y border-dashed border-gray-300 py-3">
               <span>{post.publishedAt ? format(formatFirestoreTime(post.publishedAt), 'MMMM dd, yyyy') : 'Recently'}</span>
               <span>//</span>
               <span>{post.readTime} read</span>
               <span>//</span>
               <span className="bg-chalk-yellow px-1">mood: {post.mood}</span>
             </div>
          </header>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="prose prose-lg prose-headings:font-marker prose-h2:text-3xl prose-h3:text-2xl prose-p:font-kalam prose-p:text-xl prose-p:text-gray-800 prose-p:leading-relaxed prose-li:font-kalam prose-li:text-xl prose-li:text-gray-800 prose-a:text-electric-blue prose-a:decoration-wavy max-w-none"
          >
            <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
          </motion.div>
        </div>
      </motion.div>

      {/* Comments Section */}
      <div className="mt-16 bg-[#faf9f5] border-t-4 border-black p-8 relative">
        <div className="absolute -top-4 right-8 w-20 h-8 bg-blue-200/50 mask-tape -rotate-3" />
        
        <h3 className="font-sans font-black text-3xl mb-8 uppercase tracking-tighter">Echo Chamber ({comments.length})</h3>

        <div className="space-y-6 mb-12">
          {comments.map((comment, i) => (
             <div key={comment.id} className="bg-white p-4 border border-gray-200 relative">
               <div className="font-typewriter text-xs text-gray-500 mb-2 flex justify-between">
                 <span className="font-bold text-black">{comment.authorAlias}</span>
                 {comment.createdAt && <span>{format(formatFirestoreTime(comment.createdAt), 'MMM d, yyyy h:mm a')}</span>}
               </div>
               <p className="font-sans text-lg">{comment.content}</p>
             </div>
          ))}
        </div>

        <form onSubmit={handleCommentSubmit} className="bg-kraft p-6 shadow-md relative group">
          <div className="absolute -left-2 -top-2 w-6 h-6 bg-red-500 rounded-full shadow-md z-10 hidden md:block" />
          <h4 className="font-marker text-white text-2xl mb-4">Leave a thought</h4>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Alias (optional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full font-typewriter p-2 bg-[#fffdf0] border-b-2 border-black outline-none focus:bg-white"
              maxLength={50}
            />
            <textarea
              placeholder="Scream into the void... (max 500 chars)"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full font-caveat text-xl p-3 bg-[#fffdf0] border-2 border-black outline-none focus:bg-white resize-y min-h-[100px]"
              maxLength={500}
              required
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="font-typewriter bg-black text-white px-6 py-2 transform rotate-1 hover:rotate-2 hover:bg-electric-blue transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post it'}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
