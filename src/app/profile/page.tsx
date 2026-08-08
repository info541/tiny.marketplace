import type { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "@/components/ProfileForm";
import { ensureProfile, requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const { supabase, user } = await requireUser();
  const profile = await ensureProfile(supabase, user);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/70">Account</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.04em]">Your profile</h1>
      <p className="mt-2 text-ink-soft">
        This is how you show up across reviews and talk.{" "}
        <Link href="/dashboard" className="font-semibold text-teal-deep hover:underline">
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
