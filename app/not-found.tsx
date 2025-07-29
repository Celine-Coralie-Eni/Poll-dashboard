import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404</h2>
        <h3 className="text-2xl font-semibold mb-4">Page Not Found</h3>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
