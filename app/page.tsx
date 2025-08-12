import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="p-8 h-screen bg-yellow-100 flex items-center justify-center flex-col text-center">
      <h1 className="text-4xl font-bold mb-4">
        Track-{" "}
        <span className="bg-yellow-600 text-white rounded-2xl px-4">
          Productvity
        </span>
      </h1>
      <p className="mb-4">
        This app is for productivity and issue tracking, built with Next.js and
        GraphQL.
      </p>
      <p className="mb-6">
        Explore the features, manage your tasks, and enjoy the seamless
        integration of modern web technologies.
      </p>

      <div className="space-x-4">
        <Link href="/login">
          <Button variant="default">Login</Button>
        </Link>
        <Link href="/register">
          <Button variant="secondary">Register</Button>
        </Link>
      </div>
    </section>
  );
}
