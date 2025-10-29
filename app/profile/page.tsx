import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <Link href="/scan">
        <button className="bg-green-600 text-white px-4 py-2 rounded">Go to Scanner</button>
      </Link>

      {/* existing search UI below */}
    </div>
  );
}
