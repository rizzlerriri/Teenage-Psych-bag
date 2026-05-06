import { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import RansomTitle from '../components/RansomTitle';
import { format } from 'date-fns';
import { formatFirestoreTime } from '../lib/utils';

const ADMIN_EMAILS = ['mayarawat8624@gmail.com', 'rawatritishka@gmail.com'];

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [activeTab, setActiveTab] = useState<'post' | 'about' | 'interactions'>('post');

  // Post form states
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [mood, setMood] = useState('');
  const [readTime, setReadTime] = useState('3 min');
  const [isPublished, setIsPublished] = useState(false);
  
  // About Me form states
  const [aboutContent, setAboutContent] = useState('');
  const [loadingAbout, setLoadingAbout] = useState(false);

  // Interactions state
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingConfig(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && ADMIN_EMAILS.includes(user.email)) {
      if (activeTab === 'about') {
        const fetchAbout = async () => {
          setLoadingAbout(true);
          try {
            const docSnap = await getDoc(doc(db, 'settings', 'about_me'));
            if (docSnap.exists()) {
              setAboutContent(docSnap.data().content || '');
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, 'settings/about_me');
          } finally {
            setLoadingAbout(false);
          }
        };
        fetchAbout();
      } else if (activeTab === 'interactions') {
        const fetchComments = async () => {
          setLoadingComments(true);
          try {
            const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'), limit(50));
            const querySnapshot = await getDocs(q);
            setComments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          } catch (error) {
            handleFirestoreError(error, OperationType.LIST, 'comments');
          } finally {
            setLoadingComments(false);
          }
        };
        fetchComments();
      }
    }
  }, [user, activeTab]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    setMessage('');
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        excerpt,
        content,
        category,
        mood,
        readTime,
        publishedAt: isPublished ? serverTimestamp() : 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublished,
        authorId: user.uid
      });
      setMessage('Post created!');
      setTitle(''); setExcerpt(''); setContent(''); setCategory(''); setMood('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'posts');
      setMessage('Error creating post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'settings', 'about_me'), {
        content: aboutContent,
        updatedAt: serverTimestamp()
      });
      setMessage('About Me section updated!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/about_me');
      setMessage('Error updating About Me.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingConfig) return <div className="text-center py-20 font-typewriter">Hold on...</div>;

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <RansomTitle text="Secrets" size="md" className="mb-8" />
        <p className="font-typewriter mb-8">Author access only. Keep out.</p>
        <button 
          onClick={handleLogin}
          className="bg-black text-white px-6 py-3 font-marker shadow-[6px_6px_0_0_#ff3333] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#ff3333] transition-all"
        >
          Authenticate
        </button>
        {user && !ADMIN_EMAILS.includes(user.email) && (
          <p className="text-red-500 mt-4 font-sans font-bold bg-white p-2 border border-red-500">
             You are logged in as {user.email}, but you are not the chosen one.
             <button onClick={() => signOut(auth)} className="ml-2 underline text-blue-600">Sign out</button>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
         <h1 className="font-marker text-4xl text-purple-pen">Admin Dashboard</h1>
         <button onClick={() => signOut(auth)} className="font-typewriter text-sm underline hover:text-crayon-red">Sign Out</button>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('post')}
          className={`font-typewriter px-4 py-2 border-2 border-black ${activeTab === 'post' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
        >
          New Post
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`font-typewriter px-4 py-2 border-2 border-black ${activeTab === 'about' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
        >
          Edit About Me
        </button>
        <button 
          onClick={() => setActiveTab('interactions')}
          className={`font-typewriter px-4 py-2 border-2 border-black ${activeTab === 'interactions' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
        >
          Interactions
        </button>
      </div>

      {message && (
        <div className="bg-chalk-yellow p-4 mb-6 border-2 border-black font-kalam text-xl transform -rotate-1">
          {message}
        </div>
      )}

      {activeTab === 'post' ? (
        <form onSubmit={handlePostSubmit} className="space-y-6 bg-white p-8 border border-gray-300 shadow-md">
          {/* ... existing form ... */}
          <div>
            <label className="block font-typewriter mb-2">Title</label>
            <input type="text" value={title} onChange={e=>setTitle(e.target.value)} required className="w-full border p-2 font-sans" />
          </div>
          
          <div>
            <label className="block font-typewriter mb-2">Excerpt</label>
            <input type="text" value={excerpt} onChange={e=>setExcerpt(e.target.value)} required className="w-full border p-2 font-sans" />
          </div>

          <div>
            <label className="block font-typewriter mb-2">Category</label>
            <input type="text" value={category} onChange={e=>setCategory(e.target.value)} required className="w-full border p-2 font-sans" placeholder="e.g. Psychology" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-typewriter mb-2">Mood</label>
              <input type="text" value={mood} onChange={e=>setMood(e.target.value)} required className="w-full border p-2 font-sans" placeholder="e.g. melancholic" />
            </div>
            <div>
               <label className="block font-typewriter mb-2">Read Time</label>
               <input type="text" value={readTime} onChange={e=>setReadTime(e.target.value)} required className="w-full border p-2 font-sans" />
            </div>
          </div>

          <div>
            <label className="block font-typewriter mb-2">Markdown Content</label>
            <textarea value={content} onChange={e=>setContent(e.target.value)} required className="w-full border p-4 font-mono h-64" />
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 border border-gray-200">
            <input type="checkbox" id="published" checked={isPublished} onChange={e=>setIsPublished(e.target.checked)} className="w-5 h-5 accent-black" />
            <label htmlFor="published" className="font-typewriter">Publish immediately</label>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="bg-black text-white px-8 py-3 font-marker hover:bg-electric-blue transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      ) : activeTab === 'about' ? (
        <form onSubmit={handleAboutSubmit} className="space-y-6 bg-white p-8 border border-gray-300 shadow-md">
          {loadingAbout ? (
            <p className="font-typewriter">Loading current content...</p>
          ) : (
            <>
              <div>
                <label className="block font-typewriter mb-2">About Me Content (Markdown)</label>
                <textarea 
                  value={aboutContent} 
                  onChange={e=>setAboutContent(e.target.value)} 
                  required 
                  className="w-full border p-4 font-mono h-96"
                  placeholder="Write your manifesto here..."
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-black text-white px-8 py-3 font-marker hover:bg-electric-blue transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save About Me'}
              </button>
            </>
          )}
        </form>
      ) : activeTab === 'interactions' ? (
        <div className="space-y-6">
          {loadingComments ? (
            <p className="font-typewriter">Loading interactions...</p>
          ) : comments.length === 0 ? (
            <p className="font-typewriter text-gray-500 bg-white p-8 border border-gray-200">No recent interactions.</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-white p-6 border border-gray-300 shadow-sm relative group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold font-sans">{comment.authorAlias}</span>
                    <span className="text-gray-500 font-typewriter text-xs ml-3">
                      {comment.createdAt ? format(formatFirestoreTime(comment.createdAt), 'MMM d, yyyy h:mm a') : 'Unknown time'}
                    </span>
                  </div>
                  <div className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Post ID: {comment.postId}
                  </div>
                </div>
                <p className="font-serif text-lg">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
