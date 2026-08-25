"use server";

import { updateTag } from "next/cache";
import { requireUser } from "@/lib/auth";
import { COMMUNITY_CACHE_TAG, HOMEPAGE_CACHE_TAG } from "@/lib/cache-tags";

function revalidateCommunityPages() {
  updateTag(COMMUNITY_CACHE_TAG);
  updateTag(HOMEPAGE_CACHE_TAG);
}

export type CreateCommunityPostInput = {
  topic: string;
  title: string;
  body: string;
  tags?: string[];
};

export async function createCommunityPost(input: CreateCommunityPostInput) {
  const topic = input.topic.trim();
  const title = input.title.trim();
  const body = input.body.trim();

  if (!topic || !title || !body) {
    return { error: "Topic, title, and body are required." };
  }

  const { supabase, user } = await requireUser();
  const author = user.email?.split("@")[0] ?? "member";

  const { error } = await supabase.from("community_posts").insert({
    user_id: user.id,
    author,
    topic,
    title,
    body,
    tags: input.tags ?? [],
  });

  if (error) {
    return { error: error.message };
  }

  revalidateCommunityPages();
  return { ok: true as const };
}

export async function deleteCommunityPost(postId: string) {
  if (!postId) {
    return { error: "Missing post id." };
  }

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidateCommunityPages();
  return { ok: true as const };
}
