import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center text-white">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
      />

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Satellite Internet Packages
        </h1>

        <p className="text-lg md:text-xl mb-8 text-gray-200">
          Fast. Reliable. Anywhere.
        </p>

        <Link
          href="/packages"
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          View Packages
        </Link>
      </div>

    </main>
  );
}
