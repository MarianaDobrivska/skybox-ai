"use client";
import Loader from "@/components/Loader";
import PanoramaViewer from "@/components/PanoramaViewer";
import { useImage } from "@/hooks/useQueries";
import { useParams } from "next/navigation";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useImage(id);

  return isLoading ? <Loader /> : <PanoramaViewer imageUrl={data?.url} />;
}
