import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Camera, 
  Sparkles, 
  Send, 
  MapPin, 
  Plus, 
  Upload, 
  Check, 
  Flame
} from 'lucide-react';
import { SocialPost } from '../types';

interface SocialFeedViewProps {
  posts: SocialPost[];
  onAddPost: (post: SocialPost) => void;
  onOpenAIStudio: () => void;
}

export const SocialFeedView: React.FC<SocialFeedViewProps> = ({
  posts,
  onAddPost,
  onOpenAIStudio,
}) => {
  const [feedPosts, setFeedPosts] = useState<SocialPost[]>(posts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [venueTag, setVenueTag] = useState('GMDC Ground Vibrant Navratri');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80');
  const [tagsInput, setTagsInput] = useState('#DodhiyaRaas #AmdavadNights #ChaniyaCholi');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync state if external prop changes
  React.useEffect(() => {
    setFeedPosts(posts);
  }, [posts]);

  const handleLike = (id: string) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      userName: 'Aarav Mehta',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      venueName: venueTag,
      image: imageUrl,
      caption: caption.trim(),
      tags: tagsInput.split(' ').filter(Boolean),
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      timestamp: 'Just now',
      isLive: true,
    };

    onAddPost(newPost);
    setFeedPosts([newPost, ...feedPosts]);
    setShowCreateModal(false);
    setCaption('');
  };

  const handleShare = (post: SocialPost) => {
    if (navigator.share) {
      navigator.share({
        title: `Ahmedabad Navratri Live Vibe at ${post.venueName}`,
        text: post.caption,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 max-w-2xl mx-auto">
      
      {/* Create Post Banner & Studio Call to Action */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/60 border border-purple-500/30 flex items-center justify-between gap-3 shadow-lg">
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> RaasGram • Amdavad Live Vibe
          </h3>
          <p className="text-xs text-slate-300">
            Share live Garba photos, outfit checks, and midnight food stories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIStudio}
            className="px-2.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-400/40 text-purple-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
            title="Create AI Garba Artwork"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-slate-950" />
            <span>Post Vibe</span>
          </button>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4 sm:space-y-5">
        {feedPosts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Post Author Bar */}
            <div className="p-3 sm:p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    {post.userName}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-300/90">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{post.venueName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.isLive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    LIVE
                  </span>
                )}
                <span className="text-[11px] text-slate-400">{post.timestamp}</span>
              </div>
            </div>

            {/* Post Image */}
            <div className="relative bg-slate-950 max-h-[460px] overflow-hidden flex items-center justify-center">
              <img
                src={post.image}
                alt="Navratri Moment"
                className="w-full h-auto object-cover max-h-[440px]"
              />
            </div>

            {/* Post Interaction Bar */}
            <div className="p-3 sm:p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-125 cursor-pointer"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        post.isLiked
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-slate-400 hover:text-rose-400'
                      }`}
                    />
                    <span className={post.isLiked ? 'text-rose-400' : 'text-slate-300'}>
                      {post.likes}
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <MessageCircle className="w-5 h-5 text-slate-400" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleShare(post)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedId === post.id && (
                    <span className="text-[10px] text-emerald-400">Link Copied!</span>
                  )}
                </button>
              </div>

              {/* Caption */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <span className="font-bold text-white mr-1.5">{post.userName}</span>
                {post.caption}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-purple-950/80 to-slate-900 flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" /> Share Live Garba Vibe
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Garba Ground or Food Spot in Ahmedabad:
                </label>
                <select
                  value={venueTag}
                  onChange={(e) => setVenueTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm"
                >
                  <option>GMDC Ground Vibrant Navratri</option>
                  <option>Karnavati Club, SG Highway</option>
                  <option>Rajpath Club, SG Highway</option>
                  <option>Mandvi Ni Pol Heritage Sheri Garba</option>
                  <option>Mirchi Rock N Dhol, SBR</option>
                  <option>Manek Chowk Midnight Food Court</option>
                  <option>Sindhu Bhavan Road Food Street</option>
                  <option>Shankus Water World Arena</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Photo URL or Live Snap:
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Caption / Atmosphere:
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  placeholder="Share how the Dodhiya steps are flowing, the artist performance, or your midnight food cravings..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Hashtags:
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Publish to RaasGram Live
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
