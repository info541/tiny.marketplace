"use cache: remote";

import { cacheLife, cacheTag } from "next/cache";
import { COMMUNITY_CACHE_TAG } from "@/lib/cache-tags";
import { communityPosts as staticPosts } from "@/lib/data";
import { createPublicClient } from "@/lib/supabase/public";
import type { CommunityPost } from "@/lib/types";

type CommunityPostRow = {
  id: string;
  author: string;
  topic: string;
  title: string;
  body: string;
  replies: number;
  likes: number;
  tags: string[] | null;
  created_at: string;
};

function mapRow(row: CommunityPostRow): CommunityPost {
  const hoursAgo = Math.max(
    0,
    Math.floor((Date.now() - new Date(row.created_at).getTime()) / (1000 * 60 * 60)),
  );

  return {
    id: row.id,
    author: row.author,
    topic: row.topic,
    title: row.title,
    body: row.body,
    replies: row.replies,
    likes: row.likes,
    hoursAgo,
    tags: row.tags ?? [],
  };
}

export async function listCommunityPosts(): Promise<CommunityPost[]> {
  cacheLife("max");
  cacheTag(COMMUNITY_CACHE_TAG);

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("community_posts")
    .select("id, author, topic, title, body, replies, likes, tags, created_at")
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return staticPosts;
  }

  return data.map((row) => mapRow(row as CommunityPostRow));
}
