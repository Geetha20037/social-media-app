import {
  createContext,
  useContext,
  useState,
} from "react";

const SocialContext = createContext();

const defaultPosts = [
  {
    id: 1,
    userId: "demo-1",
    username: "alexjohnson",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=12",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1000",
    caption: "Beautiful moments ✨",
    likes: 124,
    likedBy: [],
    comments: [
      {
        id: 1,
        username: "sarah",
        text: "This looks amazing!",
      },
    ],
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    userId: "demo-2",
    username: "sarahlee",
    name: "Sarah Lee",
    avatar: "https://i.pravatar.cc/150?img=32",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1000",
    caption: "Weekend escape 🌿",
    likes: 89,
    likedBy: [],
    comments: [],
    createdAt: "5 hours ago",
  },
];

const defaultStories = [
  {
    id: 1,
    username: "maya_wilson",
    name: "Maya Wilson",
    avatar: "https://i.pravatar.cc/150?img=5",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900",
  },
  {
    id: 2,
    username: "alex_johnson",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=12",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900",
  },
  {
    id: 3,
    username: "sarah_smith",
    name: "Sarah Smith",
    avatar: "https://i.pravatar.cc/150?img=32",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900",
  },
  {
    id: 4,
    username: "david_miller",
    name: "David Miller",
    avatar: "https://i.pravatar.cc/150?img=15",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900",
  },
];

export function SocialProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    const savedPosts =
      localStorage.getItem("socially_posts");

    return savedPosts
      ? JSON.parse(savedPosts)
      : defaultPosts;
  });

  const [stories] = useState(() => {
    const savedStories =
      localStorage.getItem("socially_stories");

    if (savedStories) {
      return JSON.parse(savedStories);
    }

    localStorage.setItem(
      "socially_stories",
      JSON.stringify(defaultStories)
    );

    return defaultStories;
  });

  const [following, setFollowing] = useState(() => {
    const saved =
      localStorage.getItem("socially_following");

    return saved ? JSON.parse(saved) : [];
  });

  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts);

    localStorage.setItem(
      "socially_posts",
      JSON.stringify(updatedPosts)
    );
  };

  /* ================================
     CREATE POST
  ================================= */

  const addPost = ({ image, caption, user }) => {
    const newPost = {
      id: Date.now(),
      userId: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      image,
      caption,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: "Just now",
    };

    savePosts([newPost, ...posts]);

    return newPost;
  };

  /* ================================
     LIKE
  ================================= */

  const toggleLike = (postId, currentUser) => {
    const username = currentUser?.username;

    const updatedPosts = posts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      const likedBy = post.likedBy || [];

      const alreadyLiked = username
        ? likedBy.includes(username)
        : post.liked;

      if (alreadyLiked) {
        return {
          ...post,
          likes: Math.max(0, post.likes - 1),
          liked: false,
          likedBy: likedBy.filter(
            (item) => item !== username
          ),
        };
      }

      return {
        ...post,
        likes: post.likes + 1,
        liked: true,
        likedBy: username
          ? [...likedBy, username]
          : likedBy,
      };
    });

    savePosts(updatedPosts);
  };

  /* ================================
     COMMENT
  ================================= */

  const addComment = (
    postId,
    comment,
    user
  ) => {
    if (!comment?.trim()) {
      return;
    }

    const updatedPosts = posts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      return {
        ...post,
        comments: [
          ...(post.comments || []),
          {
            id: Date.now(),
            username:
              user?.username || "user",
            name: user?.name || "User",
            text: comment.trim(),
          },
        ],
      };
    });

    savePosts(updatedPosts);
  };

  /* ================================
     FOLLOW
  ================================= */

  const toggleFollow = (
    targetUsername,
    currentUser
  ) => {
    if (!targetUsername || !currentUser) {
      return;
    }

    if (
      targetUsername.toLowerCase() ===
      currentUser.username?.toLowerCase()
    ) {
      return;
    }

    const isFollowing = following.includes(
      targetUsername
    );

    let updatedFollowing;

    if (isFollowing) {
      updatedFollowing = following.filter(
        (username) =>
          username !== targetUsername
      );
    } else {
      updatedFollowing = [
        ...following,
        targetUsername,
      ];
    }

    setFollowing(updatedFollowing);

    localStorage.setItem(
      "socially_following",
      JSON.stringify(updatedFollowing)
    );

    /*
      Store followers for each user.
    */
    const followers =
      JSON.parse(
        localStorage.getItem(
          "socially_followers"
        )
      ) || {};

    const currentFollowers =
      followers[targetUsername] || [];

    if (isFollowing) {
      followers[targetUsername] =
        currentFollowers.filter(
          (username) =>
            username !== currentUser.username
        );
    } else {
      if (
        !currentFollowers.includes(
          currentUser.username
        )
      ) {
        followers[targetUsername] = [
          ...currentFollowers,
          currentUser.username,
        ];
      }
    }

    localStorage.setItem(
      "socially_followers",
      JSON.stringify(followers)
    );
  };

  const isFollowing = (username) => {
    return following.includes(username);
  };

  /* ================================
     FOLLOWERS
  ================================= */

  const getFollowers = (username) => {
    const followers =
      JSON.parse(
        localStorage.getItem(
          "socially_followers"
        )
      ) || {};

    return followers[username] || [];
  };

  /* ================================
     STORIES
  ================================= */

  const addStory = ({
    image,
    user,
  }) => {
    const newStory = {
      id: Date.now(),
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      image,
    };

    const updatedStories = [
      newStory,
      ...stories,
    ];

    localStorage.setItem(
      "socially_stories",
      JSON.stringify(updatedStories)
    );
  };

  return (
    <SocialContext.Provider
      value={{
        posts,
        stories,
        following,

        addPost,
        toggleLike,
        addComment,

        toggleFollow,
        isFollowing,
        getFollowers,

        addStory,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  return useContext(SocialContext);
}