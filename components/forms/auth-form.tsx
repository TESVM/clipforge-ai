"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/shared/button";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("demo@clipforge.ai");
  const [password, setPassword] = useState("Demo123!");
  const [name, setName] = useState("ClipForge Demo");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    if (mode === "signup" && !name.trim()) {
      setError("Name is required.");
      setIsLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setError("Invalid demo credentials.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" ? (
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Name</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400/40"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Email</span>
        <input
          type="email"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Password</span>
        <input
          type="password"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : mode === "login" ? "Login" : "Create account"}
      </Button>
      <p className="text-center text-xs text-slate-500">
        Demo credentials are prefilled so the mocked MVP works immediately.
      </p>
    </form>
  );
}
