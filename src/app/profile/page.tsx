import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProfileForm } from "@/components/ProfileForm";
import { ensureProfile, requireUser } from "@/lib/auth";
import ProfileLoading from "./loading";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const { supabase, user } = await requireUser();
  const profile = await ensureProfile(supabase, user);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Account</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">Your profile</h1>
      <p className="mt-2 text-sm text-ink-soft sm:text-base">
        This is how you show up across reviews and talk.{" "}
        <Link href="/dashboard" className="font-medium text-ink underline-offset-4 hover:underline">
          Back to dashboard
        </Link>
      </p>
      <div className="mt-8">
        <ProfileForm
          email={user.email ?? ""}
          initialDisplayName={profile?.display_name ?? user.email?.split("@")[0] ?? ""}
          initialBio={profile?.bio ?? ""}
        />
      </div>
    </div>
  );
}
