"use client";
import Loader from "@/components/Loader";
import PanoramaViewer from "@/components/PanoramaViewer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [src, setSrc] = useState("");

  async function fetchImageUrl(id: string) {
    const res = await fetch(`/api/image/${id}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch image");
    }

    return data.url;
  }

  useEffect(() => {
    fetchImageUrl(id).then(setSrc).catch(console.error);
  }, []);

  return src ? <PanoramaViewer imageUrl={src} /> : <Loader />;
}
