import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
        Satellite Internet Packages
      </h1>

      <p className="mb-8 text-gray-600 text-base md:text-lg">
        Fast. Reliable. Anywhere.
      </p>

      <Link
        href="/packages"
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        View Packages
      </Link>
    </main>
  );
}
