import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import CreatePost from "./CreatePost";

function PageLayout({ children }) {
  const [showCreatePost, setShowCreatePost] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Sidebar
        onCreatePost={() => setShowCreatePost(true)}
      />

      <div className="lg:ml-[250px]">
        <Header
          onCreatePost={() => setShowCreatePost(true)}
        />

        <main className="w-full px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>

      <MobileNav
        onCreatePost={() => setShowCreatePost(true)}
      />

      <CreatePost
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </div>
  );
}

export default PageLayout;