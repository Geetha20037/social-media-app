import PageLayout from "../components/PageLayout";

const images = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=700",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=700",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=700",
];

function Explore() {
  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[1100px]">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Explore
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Discover posts from the Socially community.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image}
              className={`overflow-hidden rounded-2xl bg-slate-200 ${
                index === 0
                  ? "sm:col-span-2 sm:row-span-2"
                  : ""
              }`}
            >
              <img
                src={image}
                alt={`Explore ${index + 1}`}
                className="h-full min-h-[180px] w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default Explore;