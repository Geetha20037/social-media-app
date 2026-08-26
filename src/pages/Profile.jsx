import { useEffect, useState } from "react";
import {
  Grid3X3,
  Heart,
  MessageCircle,
  Pencil,
} from "lucide-react";

import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import { useSocial } from "../context/SocialContext";

function Profile() {
  const { user } = useAuth();
  const { posts } = useSocial();

  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  /* --------------------------------
     GET CURRENT COUNTS
  -------------------------------- */

  const loadCounts = () => {
    if (!user) return;

    /*
      Search.jsx saves followed users here.
    */
    const followingUsers = JSON.parse(
      localStorage.getItem("socially_following_users") || "[]"
    );

    /*
      Always use the actual followed-user list length.
      This makes Profile count update correctly.
    */
    setFollowingCount(followingUsers.length);

    /*
      Followers
    */
    const savedUser = JSON.parse(
      localStorage.getItem("socially_user") || "null"
    );

    setFollowersCount(
      Number(savedUser?.followers || user?.followers || 0)
    );
  };

  /* --------------------------------
     LOAD WHEN PROFILE OPENS
  -------------------------------- */

  useEffect(() => {
    loadCounts();

    /*
      Listen for storage changes from other pages/tabs.
    */
    const handleStorage = () => {
      loadCounts();
    };

    window.addEventListener("storage", handleStorage);

    /*
      Check localStorage periodically so that
      Search follow/unfollow changes appear here.
    */
    const interval = setInterval(() => {
      loadCounts();
    }, 300);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [user]);

  /* --------------------------------
     ONLY CURRENT USER POSTS
  -------------------------------- */

  const myPosts = posts.filter(
    (post) =>
      String(post.userId) === String(user?.id) ||
      post.username === user?.username
  );

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[1000px]">

        {/* PROFILE CARD */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* COVER */}

          <div className="h-32 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-600 sm:h-40" />

          <div className="px-5 pb-7 sm:px-8">

            {/* PROFILE IMAGE */}

            <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">

              <img
                src={
                  user?.avatar ||
                  "https://i.pravatar.cc/150?img=47"
                }
                alt={user?.name || "Profile"}
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg sm:h-32 sm:w-32"
              />

              <button
                type="button"
                onClick={() => {
                  alert("Edit Profile");
                }}
                className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                <Pencil size={17} />
                Edit profile
              </button>

            </div>

            {/* USER DETAILS */}

            <div className="mt-5">

              <h1 className="text-2xl font-extrabold text-slate-900">
                {user?.name || "Your Name"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                @{user?.username || "username"}
              </p>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
                {user?.bio ||
                  "Welcome to my Socially profile!"}
              </p>

            </div>

            {/* STATS */}

            <div className="mt-6 flex gap-8">

              {/* POSTS */}

              <div>
                <p className="text-lg font-extrabold text-slate-900">
                  {myPosts.length}
                </p>

                <p className="text-xs text-slate-500">
                  Posts
                </p>
              </div>

              {/* FOLLOWERS */}

              <div>
                <p className="text-lg font-extrabold text-slate-900">
                  {followersCount}
                </p>

                <p className="text-xs text-slate-500">
                  Followers
                </p>
              </div>

              {/* FOLLOWING */}

              <div>
                <p className="text-lg font-extrabold text-slate-900">
                  {followingCount}
                </p>

                <p className="text-xs text-slate-500">
                  Following
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* POSTS SECTION */}

        <div className="mt-8">

          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">

            <Grid3X3 size={19} />

            <span className="text-sm font-bold text-slate-900">
              POSTS
            </span>

          </div>

          {myPosts.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Grid3X3
                  size={24}
                  className="text-slate-400"
                />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No posts yet
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create your first post and share it with
                your friends.
              </p>

            </div>

          ) : (

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

              {myPosts.map((post) => (

                <div
                  key={post.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200"
                >

                  <img
                    src={post.image}
                    alt={post.caption || "Post"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/60 opacity-0 transition group-hover:opacity-100">

                    <span className="flex items-center gap-2 font-bold text-white">
                      <Heart
                        size={19}
                        fill="white"
                      />
                      {post.likes}
                    </span>

                    <span className="flex items-center gap-2 font-bold text-white">
                      <MessageCircle size={19} />
                      {post.comments?.length || 0}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </div>
    </PageLayout>
  );
}

export default Profile;