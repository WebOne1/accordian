"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [subscription, setSubscription] =
    useState("free");

  useEffect(() => {
    getUser();
    getVideos();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("subscription")
      .eq("id", user.id)
      .single();

    if (data) {
      setSubscription(data.subscription);
    }
  }

  async function getVideos() {
  const { data } = await supabase
    .from("videos")
    .select("*");

  const sortedVideos = (data || []).sort(
    (a, b) => {
      const order = {
        free: 1,
        premium: 2,
        single_purchase: 3
      };

      return (
        order[a.access_type as keyof typeof order] -
        order[b.access_type as keyof typeof order]
      );
    }
  );

  setVideos(sortedVideos);
}

  return (
    <div className="p-10">
      <h1 className="text-3xl">
        Accordion Videos
      </h1>

      <p>Plan: {subscription}</p>

      {videos.map((video) => (
        <div
          key={video.id}
          className="border p-5 mt-5"
        >
          <h2>{video.title}</h2>

          {(video.access_type === "free" ||
            (video.access_type === "premium" &&
             subscription === "premium")) ? (

            <iframe
              width="560"
              height="315"
              src={video.youtube_url.replace(
                "watch?v=",
                "embed/"
              )}
            />

          ) : video.access_type ===
            "single_purchase" ? (

            <button className="border p-3 rounded">
  Buy this Lesson
</button>

          ) : (

            <button className="border p-3 rounded">
  Upgrade to Premium
</button>

          )}
        </div>
      ))}
    </div>
  );
}