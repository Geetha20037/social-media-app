import { useRef, useState } from "react";
import {
  Image as ImageIcon,
  X,
  Upload,
  LoaderCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useSocial } from "../context/SocialContext";

function CreatePost({ isOpen, onClose }) {
  const { user } = useAuth();
  const { addPost } = useSocial();

  const fileInputRef = useRef(null);

  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  if (!isOpen) {
    return null;
  }

  /* ---------------- IMAGE SELECT ---------------- */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.onerror = () => {
      setError("Unable to read this image. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  /* ---------------- REMOVE IMAGE ---------------- */

  const removeImage = () => {
    setImage("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ---------------- CLOSE MODAL ---------------- */

  const handleClose = () => {
    if (isPosting) {
      return;
    }

    setImage("");
    setCaption("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  /* ---------------- CREATE POST ---------------- */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!user) {
      setError("Please login before creating a post.");
      return;
    }

    if (!image) {
      setError("Please select a photo.");
      return;
    }

    if (!caption.trim()) {
      setError("Please write something about your post.");
      return;
    }

    if (caption.trim().length < 2) {
      setError("Caption must contain at least 2 characters.");
      return;
    }

    setIsPosting(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      const newPost = addPost({
        image,
        caption: caption.trim(),
        user,
      });

      if (!newPost) {
        setError("Unable to create the post.");
        setIsPosting(false);
        return;
      }

      /* Reset form */

      setImage("");
      setCaption("");
      setError("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setIsPosting(false);

      onClose();
    } catch (error) {
      console.error("Create post error:", error);

      setError(
        "Something went wrong while creating your post."
      );

      setIsPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 py-5 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-[580px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* ================= HEADER ================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Create a post
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Share something with your community
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isPosting}
            className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6"
        >
          {/* USER */}

          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatar ||
                "https://i.pravatar.cc/150?img=47"
              }
              alt={user?.name || "User"}
              className="h-11 w-11 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-bold text-slate-900">
                {user?.name || "Your Name"}
              </p>

              <p className="text-xs text-slate-500">
                @{user?.username || "username"}
              </p>
            </div>
          </div>

          {/* CAPTION */}

          <textarea
            value={caption}
            onChange={(event) => {
              setCaption(event.target.value);
              setError("");
            }}
            placeholder="What's happening?"
            maxLength={500}
            rows={4}
            className="mt-5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />

          <div className="mt-2 flex justify-end">
            <span
              className={`text-xs ${
                caption.length >= 450
                  ? "text-orange-500"
                  : "text-slate-400"
              }`}
            >
              {caption.length}/500
            </span>
          </div>

          {/* ================= IMAGE ================= */}

          {image ? (
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={image}
                alt="Post preview"
                className="max-h-[430px] w-full object-contain"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-3 top-3 rounded-full bg-slate-950/75 p-2 text-white transition hover:bg-slate-950"
                title="Remove image"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-3 left-3 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-white">
                Image preview
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="mt-4 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-12 transition hover:border-slate-400 hover:bg-slate-100"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <ImageIcon
                  size={25}
                  className="text-slate-500"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Add a photo
              </p>

              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG or WEBP · Maximum 5MB
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                <Upload size={15} />
                Choose image
              </span>
            </button>
          )}

          {/* FILE INPUT */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* ERROR */}

          {error && (
            <div className="mt-4 flex items-center rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            disabled={isPosting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPosting ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />

                Posting...
              </>
            ) : (
              <>
                <Upload size={18} />

                Share post
              </>
            )}
          </button>

          {/* CANCEL */}

          <button
            type="button"
            onClick={handleClose}
            disabled={isPosting}
            className="mt-3 w-full rounded-xl py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;