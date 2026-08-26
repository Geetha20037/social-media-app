import { useState } from "react";
import {
  Play,
  Heart,
  MessageCircle,
  Send,
  X,
  Search,
} from "lucide-react";

import PageLayout from "../components/PageLayout";

import { useAuth } from "../context/AuthContext";
import { useSocial } from "../context/SocialContext";

const initialReels = [
  {
    id: 101,
    userId: "reel-user-1",
    user: "maya_wilson",
    name: "Maya Wilson",
    avatar: "https://i.pravatar.cc/150?img=5",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    text: "Beautiful moments ✨",
    likes: 128,
    likedBy: [],
    comments: [],
  },
  {
    id: 102,
    userId: "reel-user-2",
    user: "alex_johnson",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=12",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    text: "Weekend vibes!",
    likes: 94,
    likedBy: [],
    comments: [],
  },
];

const members = [
  {
    id: "member-1",
    name: "Maya Wilson",
    username: "maya_wilson",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "member-2",
    name: "Alex Johnson",
    username: "alex_johnson",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "member-3",
    name: "Sarah Smith",
    username: "sarah_smith",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "member-4",
    name: "David Miller",
    username: "david_miller",
    image: "https://i.pravatar.cc/150?img=15",
  },
];

function Reels() {
  const { user } = useAuth();
  const { addComment } = useSocial();

  const [reels, setReels] = useState(() => {
    const saved = localStorage.getItem("socially_reels");

    if (saved) {
      return JSON.parse(saved);
    }

    localStorage.setItem(
      "socially_reels",
      JSON.stringify(initialReels)
    );

    return initialReels;
  });

  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState("");

  const [shareReel, setShareReel] = useState(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [sharedMessage, setSharedMessage] = useState("");

  /* ================= LIKE ================= */

  const handleLike = (reelId) => {
    setReels((previous) => {
      const updated = previous.map((reel) => {
        if (reel.id !== reelId) {
          return reel;
        }

        const likedBy = Array.isArray(reel.likedBy)
          ? reel.likedBy
          : [];

        const userId = user?.id || "guest";

        const alreadyLiked = likedBy.includes(userId);

        return {
          ...reel,

          likedBy: alreadyLiked
            ? likedBy.filter((id) => id !== userId)
            : [...likedBy, userId],

          likes: alreadyLiked
            ? Math.max(0, reel.likes - 1)
            : reel.likes + 1,
        };
      });

      localStorage.setItem(
        "socially_reels",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  /* ================= COMMENT ================= */

  const openComments = (reelId) => {
    setActiveComment(reelId);
    setCommentText("");
  };

  const closeComments = () => {
    setActiveComment(null);
    setCommentText("");
  };

  const handleComment = (reel) => {
    const cleanComment = commentText.trim();

    if (!cleanComment) {
      return;
    }

    const newComment = {
      id: Date.now(),
      userId: user?.id || "guest",
      username: user?.username || "you",
      name: user?.name || "You",
      text: cleanComment,
    };

    setReels((previous) => {
      const updated = previous.map((item) => {
        if (item.id !== reel.id) {
          return item;
        }

        return {
          ...item,
          comments: [
            ...(item.comments || []),
            newComment,
          ],
        };
      });

      localStorage.setItem(
        "socially_reels",
        JSON.stringify(updated)
      );

      return updated;
    });

    setCommentText("");

    if (user) {
      addComment(reel.id, cleanComment, user);
    }
  };

  /* ================= OPEN SHARE ================= */

  const openShare = (reel) => {
    setShareReel(reel);
    setMemberSearch("");
    setSharedMessage("");
  };

  const closeShare = () => {
    setShareReel(null);
    setMemberSearch("");
    setSharedMessage("");
  };

  /* ================= SEND REEL TO MEMBER ================= */

  const sendReelToMember = (member) => {
    if (!shareReel) {
      return;
    }

    const existingMessages =
      JSON.parse(
        localStorage.getItem("socially_messages")
      ) || {};

    const conversationKey = member.username;

    if (!existingMessages[conversationKey]) {
      existingMessages[conversationKey] = [];
    }

    existingMessages[conversationKey].push({
      id: Date.now(),
      mine: true,
      type: "reel",
      text: shareReel.text,
      image: shareReel.image,
      reelId: shareReel.id,
      sender: user?.name || "You",
      receiver: member.name,
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem(
      "socially_messages",
      JSON.stringify(existingMessages)
    );

    setSharedMessage(
      `Reel sent to ${member.name}`
    );

    setTimeout(() => {
      closeShare();
    }, 900);
  };

  const filteredMembers = members.filter((member) => {
    const search = memberSearch.toLowerCase();

    return (
      member.name.toLowerCase().includes(search) ||
      member.username.toLowerCase().includes(search)
    );
  });

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[900px]">
        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Reels
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Watch short videos and discover something new.
          </p>
        </div>

        {/* REELS */}

        <div className="grid gap-6 md:grid-cols-2">
          {reels.map((reel) => {
            const liked =
              Array.isArray(reel.likedBy) &&
              reel.likedBy.includes(user?.id || "guest");

            return (
              <div
                key={reel.id}
                className="relative overflow-hidden rounded-3xl bg-slate-950 shadow-lg"
              >
                <img
                  src={reel.image}
                  alt={reel.user}
                  className="h-[600px] w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                  <Play size={18} fill="currentColor" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={reel.avatar}
                      alt={reel.name}
                      className="h-10 w-10 rounded-full border-2 border-white object-cover"
                    />

                    <div>
                      <p className="font-bold">
                        {reel.name}
                      </p>

                      <p className="text-xs text-white/70">
                        @{reel.user}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-white/90">
                    {reel.text}
                  </p>

                  <div className="mt-4 flex items-center gap-5">
                    {/* LIKE */}

                    <button
                      type="button"
                      onClick={() => handleLike(reel.id)}
                      className="flex items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm transition hover:bg-black/50"
                    >
                      <Heart
                        size={23}
                        fill={
                          liked ? "currentColor" : "none"
                        }
                        className={
                          liked
                            ? "text-red-500"
                            : "text-white"
                        }
                      />

                      <span className="text-sm font-semibold">
                        {reel.likes}
                      </span>
                    </button>

                    {/* COMMENT */}

                    <button
                      type="button"
                      onClick={() =>
                        openComments(reel.id)
                      }
                      className="flex items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm transition hover:bg-black/50"
                    >
                      <MessageCircle size={23} />

                      <span className="text-sm font-semibold">
                        {reel.comments?.length || 0}
                      </span>
                    </button>

                    {/* SHARE */}

                    <button
                      type="button"
                      onClick={() => openShare(reel)}
                      className="rounded-full bg-black/30 p-2 backdrop-blur-sm transition hover:bg-black/50"
                    >
                      <Send size={22} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= COMMENT MODAL ================= */}

      {activeComment !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[500px] overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-slate-900">
                Comments
              </h2>

              <button
                type="button"
                onClick={closeComments}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[350px] space-y-3 overflow-y-auto p-5">
              {(() => {
                const reel = reels.find(
                  (item) =>
                    item.id === activeComment
                );

                if (
                  !reel ||
                  !reel.comments?.length
                ) {
                  return (
                    <div className="py-10 text-center">
                      <MessageCircle
                        size={35}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        No comments yet
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Be the first to comment.
                      </p>
                    </div>
                  );
                }

                return reel.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {comment.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div className="rounded-2xl bg-slate-100 px-4 py-2.5">
                      <p className="text-xs font-bold text-slate-900">
                        {comment.name ||
                          comment.username}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="border-t border-slate-100 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      const reel = reels.find(
                        (item) =>
                          item.id === activeComment
                      );

                      if (reel) {
                        handleComment(reel);
                      }
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    const reel = reels.find(
                      (item) =>
                        item.id === activeComment
                    );

                    if (reel) {
                      handleComment(reel);
                    }
                  }}
                  className="rounded-xl bg-slate-900 px-4 text-white"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SHARE MODAL ================= */}

      {shareReel && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[500px] overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Share reel
                </h2>

                <p className="text-xs text-slate-400">
                  Send this reel to a Socially member
                </p>
              </div>

              <button
                type="button"
                onClick={closeShare}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Reel Preview */}

            <div className="flex items-center gap-3 border-b border-slate-100 p-4">
              <img
                src={shareReel.image}
                alt={shareReel.text}
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  {shareReel.name}
                </p>

                <p className="truncate text-sm text-slate-500">
                  {shareReel.text}
                </p>
              </div>
            </div>

            {/* Search */}

            <div className="p-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
                <Search
                  size={18}
                  className="text-slate-400"
                />

                <input
                  value={memberSearch}
                  onChange={(event) =>
                    setMemberSearch(event.target.value)
                  }
                  placeholder="Search members..."
                  className="w-full bg-transparent text-sm outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Members */}

            <div className="max-h-[300px] overflow-y-auto px-4 pb-4">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() =>
                    sendReelToMember(member)
                  }
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">
                      {member.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      @{member.username}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                    Send
                  </div>
                </button>
              ))}

              {filteredMembers.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-400">
                  No members found.
                </p>
              )}
            </div>

            {sharedMessage && (
              <div className="border-t border-slate-100 bg-green-50 px-5 py-4 text-center text-sm font-semibold text-green-600">
                {sharedMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default Reels;