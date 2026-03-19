import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import { Card } from "@/components/shared/card";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.14),transparent_25%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-4">
      <Card className="w-full max-w-md">
        <p className="text-sm uppercase tracking-[0.25em] text-rose-200/70">Create account</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Start building viral clips</h1>
        <p className="mt-3 text-sm text-slate-400">This MVP uses a credentials-based demo auth flow so the app works locally without external providers.</p>
        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have access?{" "}
          <Link href="/login" className="text-cyan-300">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
