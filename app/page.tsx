import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Satellite Internet Packages</h1>
      <p className="mb-8 text-gray-600">Fast. Reliable. Anywhere.</p>

      <Link
        href="/packages"
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        View Packages
      </Link>
    </main>
  );
}
