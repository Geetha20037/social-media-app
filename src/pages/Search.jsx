import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  UserPlus,
  UserCheck,
} from "lucide-react";

import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";

const people = [
  {
    id: "maya-1",
    name: "Maya Wilson",
    username: "maya_wilson",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "alex-1",
    name: "Alex Johnson",
    username: "alex_johnson",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "sarah-1",
    name: "Sarah Smith",
    username: "sarah_smith",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "david-1",
    name: "David Miller",
    username: "david_miller",
    image: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: "emma-1",
    name: "Emma Wilson",
    username: "emma_wilson",
    image: "https://i.pravatar.cc/150?img=44",
  },
  {
    id: "john-1",
    name: "John Miller",
    username: "john_miller",
    image: "https://i.pravatar.cc/150?img=68",
  },
];

function Search() {
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [followingUsers, setFollowingUsers] = useState([]);

  /* ---------------------------------
     LOAD FOLLOWING USERS
  --------------------------------- */

  useEffect(() => {
    const savedFollowing = JSON.parse(
      localStorage.getItem("socially_following_users") || "[]"
    );

    setFollowingUsers(savedFollowing);
  }, []);

  /* ---------------------------------
     CHECK FOLLOWING
  --------------------------------- */

  const checkFollowing = (personId) => {
    return followingUsers.some(
      (id) => String(id) === String(personId)
    );
  };

  /* ---------------------------------
     FOLLOW / UNFOLLOW
  --------------------------------- */

  const handleFollow = (personId) => {
    const alreadyFollowing = checkFollowing(personId);

    let updatedFollowing;

    if (alreadyFollowing) {
      updatedFollowing = followingUsers.filter(
        (id) => String(id) !== String(personId)
      );
    } else {
      updatedFollowing = [
        ...followingUsers,
        personId,
      ];
    }

    setFollowingUsers(updatedFollowing);

    localStorage.setItem(
      "socially_following_users",
      JSON.stringify(updatedFollowing)
    );

    /*
      Save a separate count so Profile / other pages
      can read the current following count.
    */
    const currentUser = JSON.parse(
      localStorage.getItem("socially_user")
    );

    if (currentUser) {
      currentUser.following = updatedFollowing.length;

      localStorage.setItem(
        "socially_user",
        JSON.stringify(currentUser)
      );

      const users = JSON.parse(
        localStorage.getItem("socially_users") || "[]"
      );

      const updatedUsers = users.map((item) => {
        if (String(item.id) === String(currentUser.id)) {
          return {
            ...item,
            following: updatedFollowing.length,
          };
        }

        return item;
      });

      localStorage.setItem(
        "socially_users",
        JSON.stringify(updatedUsers)
      );
    }
  };

  /* ---------------------------------
     SEARCH FILTER
  --------------------------------- */

  const filteredPeople = people.filter((person) => {
    const searchText = query.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      person.name.toLowerCase().includes(searchText) ||
      person.username.toLowerCase().includes(searchText)
    );
  });

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[900px]">

        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Search
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Find people and discover new content.
          </p>
        </div>

        {/* SEARCH BOX */}

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

          <SearchIcon
            size={21}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search people..."
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            autoFocus
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs font-semibold text-slate-400 hover:text-slate-900"
            >
              Clear
            </button>
          )}
        </div>

        {/* RESULTS */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              {query
                ? `Search results`
                : "Suggested people"}
            </h2>

            {query && (
              <p className="mt-1 text-xs text-slate-400">
                Showing results for "{query}"
              </p>
            )}
          </div>

          {filteredPeople.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <SearchIcon
                  size={24}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No people found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try searching with another name or username.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {filteredPeople.map((person) => {
                const following =
                  checkFollowing(person.id);

                return (
                  <div
                    key={person.id}
                    className="flex items-center justify-between gap-4 p-5 transition hover:bg-slate-50"
                  >

                    {/* USER */}

                    <div className="flex min-w-0 items-center gap-4">

                      <img
                        src={person.image}
                        alt={person.name}
                        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-slate-100"
                      />

                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">
                          {person.name}
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-400">
                          @{person.username}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Socially user
                        </p>
                      </div>

                    </div>

                    {/* FOLLOW BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        handleFollow(person.id)
                      }
                      className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        following
                          ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {following ? (
                        <>
                          <UserCheck size={17} />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={17} />
                          Follow
                        </>
                      )}
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* FOLLOWING SUMMARY */}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-bold text-slate-900">
                Following
              </p>

              <p className="mt-1 text-xs text-slate-400">
                People you currently follow
              </p>
            </div>

            <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-slate-900 px-3 text-sm font-bold text-white">
              {followingUsers.length}
            </div>

          </div>

        </div>

      </div>
    </PageLayout>
  );
}

export default Search;