import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import { Card } from "@/components/shared/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_25%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-4">
      <Card className="w-full max-w-md">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-200/70">ClipForge AI</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-3 text-sm text-slate-400">Use the demo credentials to access the dashboard and mocked AI pipeline.</p>
        <div className="mt-8">
          <AuthForm mode="login" />
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          Need an account?{" "}
          <Link href="/signup" className="text-cyan-300">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
