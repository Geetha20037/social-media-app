import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY = "socially_users";
const CURRENT_USER_KEY = "socially_user";
const FOLLOWING_KEY = "socially_following";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(
        CURRENT_USER_KEY
      );

      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [followingIds, setFollowingIds] = useState(() => {
    try {
      const saved = localStorage.getItem(FOLLOWING_KEY);

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* =========================
     SAVE CURRENT USER
  ========================= */

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
      );
    }
  }, [user]);

  /* =========================
     SAVE FOLLOWING IDS
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      FOLLOWING_KEY,
      JSON.stringify(followingIds)
    );
  }, [followingIds]);

  /* =========================
     SIGNUP
  ========================= */

  const signup = (userData) => {
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const email = userData.email.trim().toLowerCase();
    const username = userData.username
      .trim()
      .toLowerCase();

    const existingUser = users.find(
      (item) =>
        item.email.toLowerCase() === email ||
        item.username.toLowerCase() === username
    );

    if (existingUser) {
      return {
        success: false,
        message: "Email or username already exists.",
      };
    }

    const newUser = {
      id: Date.now(),
      name: userData.name.trim(),
      username,
      email,
      password: userData.password,
      bio: "Welcome to my Socially profile!",
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      followers: 0,
      following: 0,
      posts: [],
    };

    const updatedUsers = [...users, newUser];

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(updatedUsers)
    );

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(newUser)
    );

    setUser(newUser);

    return {
      success: true,
      message: "Account created successfully.",
    };
  };

  /* =========================
     LOGIN
  ========================= */

  const login = (email, password) => {
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        item.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(foundUser)
    );

    setUser(foundUser);

    return {
      success: true,
      message: "Login successful.",
    };
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  /* =========================
     FOLLOW USER
  ========================= */

  const followUser = (targetUserId) => {
    if (!user) {
      return {
        success: false,
        message: "Please login first.",
      };
    }

    if (String(user.id) === String(targetUserId)) {
      return {
        success: false,
        message: "You cannot follow yourself.",
      };
    }

    const alreadyFollowing = followingIds.some(
      (id) => String(id) === String(targetUserId)
    );

    if (alreadyFollowing) {
      return {
        success: false,
        message: "Already following.",
      };
    }

    const updatedFollowingIds = [
      ...followingIds,
      targetUserId,
    ];

    setFollowingIds(updatedFollowingIds);

    localStorage.setItem(
      FOLLOWING_KEY,
      JSON.stringify(updatedFollowingIds)
    );

    /* Update all users */
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const updatedUsers = users.map((item) => {
      if (String(item.id) === String(targetUserId)) {
        return {
          ...item,
          followers: Number(item.followers || 0) + 1,
        };
      }

      return item;
    });

    /* Update logged-in user's following count */
    const updatedCurrentUser = {
      ...user,
      following: Number(user.following || 0) + 1,
    };

    const finalUsers = updatedUsers.map((item) => {
      if (String(item.id) === String(user.id)) {
        return updatedCurrentUser;
      }

      return item;
    });

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(finalUsers)
    );

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(updatedCurrentUser)
    );

    setUser(updatedCurrentUser);

    return {
      success: true,
      following: true,
      user: updatedCurrentUser,
    };
  };

  /* =========================
     UNFOLLOW USER
  ========================= */

  const unfollowUser = (targetUserId) => {
    if (!user) {
      return {
        success: false,
        message: "Please login first.",
      };
    }

    const isFollowing = followingIds.some(
      (id) => String(id) === String(targetUserId)
    );

    if (!isFollowing) {
      return {
        success: false,
        message: "You are not following this user.",
      };
    }

    const updatedFollowingIds = followingIds.filter(
      (id) => String(id) !== String(targetUserId)
    );

    setFollowingIds(updatedFollowingIds);

    localStorage.setItem(
      FOLLOWING_KEY,
      JSON.stringify(updatedFollowingIds)
    );

    /* Get users */
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    /* Decrease target user's followers */
    const updatedUsers = users.map((item) => {
      if (String(item.id) === String(targetUserId)) {
        return {
          ...item,
          followers: Math.max(
            0,
            Number(item.followers || 0) - 1
          ),
        };
      }

      return item;
    });

    /* Decrease current user's following */
    const updatedCurrentUser = {
      ...user,
      following: Math.max(
        0,
        Number(user.following || 0) - 1
      ),
    };

    const finalUsers = updatedUsers.map((item) => {
      if (String(item.id) === String(user.id)) {
        return updatedCurrentUser;
      }

      return item;
    });

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(finalUsers)
    );

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(updatedCurrentUser)
    );

    setUser(updatedCurrentUser);

    return {
      success: true,
      following: false,
      user: updatedCurrentUser,
    };
  };

  /* =========================
     CHECK FOLLOWING
  ========================= */

  const isFollowingUser = (targetUserId) => {
    return followingIds.some(
      (id) => String(id) === String(targetUserId)
    );
  };

  /* =========================
     UPDATE PROFILE
  ========================= */

  const updateProfile = (updatedData) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updatedData,
    };

    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const updatedUsers = users.map((item) => {
      if (String(item.id) === String(user.id)) {
        return updatedUser;
      }

      return item;
    });

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(updatedUsers)
    );

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,

        followUser,
        unfollowUser,
        isFollowingUser,

        updateProfile,

        followingIds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}