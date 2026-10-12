import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-5xl" data-aos="fade-up">Page not found</h1>
      <p className="mt-3 text-ink/70" data-aos="fade-up">The page you are looking for has moved or does not exist.</p>
      <Link href="/" className="btn btn-dark mt-6">Back to home</Link>
    </div>
  );
}
