import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PageLayout from "../components/PageLayout";
import CreatePost from "../components/CreatePost";

import { useAuth } from "../context/AuthContext";
import { useSocial } from "../context/SocialContext";

function Home() {
  const { user } = useAuth();

  const {
    posts,
    stories,
    toggleLike,
    addComment,
  } = useSocial();

  const [createOpen, setCreateOpen] =
    useState(false);

  const [activeStory, setActiveStory] =
    useState(null);

  const [commentText, setCommentText] =
    useState({});

  const openStory = (story) => {
    setActiveStory(story);
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  const nextStory = () => {
    if (!activeStory) return;

    const index = stories.findIndex(
      (story) =>
        story.id === activeStory.id
    );

    const nextIndex =
      (index + 1) % stories.length;

    setActiveStory(stories[nextIndex]);
  };

  const previousStory = () => {
    if (!activeStory) return;

    const index = stories.findIndex(
      (story) =>
        story.id === activeStory.id
    );

    const previousIndex =
      (index - 1 + stories.length) %
      stories.length;

    setActiveStory(
      stories[previousIndex]
    );
  };

  const submitComment = (postId) => {
    const text =
      commentText[postId] || "";

    if (!text.trim()) return;

    addComment(
      postId,
      text,
      user
    );

    setCommentText((previous) => ({
      ...previous,
      [postId]: "",
    }));
  };

  return (
    <>
      <PageLayout>
        <div className="mx-auto w-full max-w-[680px]">
          {/* Stories */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex gap-5 overflow-x-auto pb-1">
              {/* Your story */}
              <button
                type="button"
                onClick={() =>
                  setCreateOpen(true)
                }
                className="shrink-0"
              >
                <div className="relative">
                  <img
                    src={
                      user?.avatar ||
                      "https://i.pravatar.cc/150?img=47"
                    }
                    alt="Your story"
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200"
                  />

                  <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white">
                    <Plus size={14} />
                  </span>
                </div>

                <p className="mt-2 w-16 truncate text-center text-xs font-medium">
                  Your story
                </p>
              </button>

              {/* Other stories */}
              {stories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() =>
                    openStory(story)
                  }
                  className="shrink-0"
                >
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-900 ring-offset-2"
                  />

                  <p className="mt-2 w-16 truncate text-center text-xs font-medium">
                    {story.username}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Post header */}
                <div className="flex items-center gap-3 p-4">
                  <img
                    src={post.avatar}
                    alt={post.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      {post.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      @{post.username} ·{" "}
                      {post.createdAt}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="rounded-full p-2 hover:bg-slate-100"
                  >
                    <MoreHorizontal
                      size={20}
                    />
                  </button>
                </div>

                {/* Image */}
                <img
                  src={post.image}
                  alt={post.caption}
                  className="max-h-[700px] w-full object-cover"
                />

                {/* Actions */}
                <div className="p-4">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={() =>
                        toggleLike(
                          post.id,
                          user
                        )
                      }
                      className={`transition ${
                        post.liked
                          ? "text-red-500"
                          : "text-slate-700"
                      }`}
                    >
                      <Heart
                        size={24}
                        fill={
                          post.liked
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById(
                            `comment-${post.id}`
                          )
                          ?.focus()
                      }
                      className="text-slate-700"
                    >
                      <MessageCircle
                        size={24}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          window.location.href
                        );
                      }}
                      className="text-slate-700"
                    >
                      <Send size={23} />
                    </button>
                  </div>

                  <p className="mt-3 text-sm font-bold">
                    {post.likes} likes
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    <span className="font-bold">
                      {post.username}
                    </span>{" "}
                    {post.caption}
                  </p>

                  {/* Comments */}
                  {post.comments?.length >
                    0 && (
                    <div className="mt-4 space-y-2">
                      {post.comments.map(
                        (comment) => (
                          <p
                            key={comment.id}
                            className="text-sm text-slate-600"
                          >
                            <span className="font-semibold text-slate-900">
                              @{comment.username}
                            </span>{" "}
                            {comment.text}
                          </p>
                        )
                      )}
                    </div>
                  )}

                  {/* Add comment */}
                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <input
                      id={`comment-${post.id}`}
                      value={
                        commentText[
                          post.id
                        ] || ""
                      }
                      onChange={(e) =>
                        setCommentText(
                          (previous) => ({
                            ...previous,
                            [post.id]:
                              e.target.value,
                          })
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter"
                        ) {
                          submitComment(
                            post.id
                          );
                        }
                      }}
                      placeholder="Add a comment..."
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        submitComment(
                          post.id
                        )
                      }
                      className="text-sm font-bold text-slate-900"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PageLayout>

      {/* Create Post */}
      <CreatePost
        isOpen={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
      />

      {/* Story Viewer */}
      {activeStory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            onClick={closeStory}
            className="absolute right-5 top-5 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={previousStory}
            className="absolute left-4 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-8"
          >
            <ChevronLeft size={25} />
          </button>

          <div className="relative h-[85vh] w-full max-w-[480px] overflow-hidden rounded-3xl bg-slate-900">
            <img
              src={activeStory.image}
              alt={activeStory.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-5">
              <div className="flex items-center gap-3">
                <img
                  src={activeStory.avatar}
                  alt={activeStory.name}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div className="text-white">
                  <p className="text-sm font-bold">
                    {activeStory.name}
                  </p>

                  <p className="text-xs text-white/70">
                    @{activeStory.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={nextStory}
            className="absolute right-4 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-8"
          >
            <ChevronRight size={25} />
          </button>
        </div>
      )}
    </>
  );
}

export default Home;