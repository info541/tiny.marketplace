"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCommunityPost } from "@/app/actions/community";

type Props = {
  postId: string;
};

export function DeleteCommunityPostButton({ postId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm("Delete this thread? This can't be undone.")) return;

    setLoading(true);
    setError(null);

    const result = await deleteCommunityPost(postId);
    setLoading(false);

    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-sm font-medium text-coral transition hover:underline disabled:opacity-60"
      >
        {loading ? "Deleting…" : "Delete thread"}
      </button>
      {error ? <p className="mt-2 text-xs font-semibold text-coral">{error}</p> : null}
    </div>
  );
}
