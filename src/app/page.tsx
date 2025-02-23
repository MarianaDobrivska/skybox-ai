"use client";
import { Key, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";

interface ImageI {
  id: Key;
  url: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const [images, setImages] = useState<ImageI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFloatedPreview, setFloatedPreview] = useState(false);
  const [floatedPreviewPosition, setFloatedPreviewPosition] = useState({
    x: 0,
    y: 0,
  });
  const hoverStartTimeRef = useRef(0);
  const activeImage = useRef<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("/api/images");
      const data = await response.json();

      if (response.ok) {
        setImages(data);
      } else {
        console.error("Error fetching images:", data.error);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  const handle360MouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    const allowZooming = Date.now() - hoverStartTimeRef.current > 550;
    if (allowZooming) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      const xPercent =
        ((e.clientX - containerRect.left) / containerRect.width) * 10;
      const yPercent =
        ((e.clientY - containerRect.top) / containerRect.height) * 10;
      setFloatedPreviewPosition({ x: xPercent - 5, y: yPercent - 0 });
    }
  };

  const handle360MouseLeave = () => {
    setFloatedPreview(false);
    setFloatedPreviewPosition({ x: 0, y: 0 });
    activeImage.current = null;
  };

  const handle360MouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    hoverStartTimeRef.current = Date.now();
    setFloatedPreview(true);
    activeImage.current = e.currentTarget.id;
  };

  const onClick = () => {
    router.push(`/preview/${activeImage.current}`);
  };

  const dynamicStyle = isFloatedPreview
    ? {
        transform: `translate(${floatedPreviewPosition.x}%, ${floatedPreviewPosition.y}%)`,
        transition: "all 150ms linear",
        scale: 1.3,
      }
    : {};

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="p-4 sm:p-6 xl:p-10">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images.map(({ id, url, description }) => (
          <div
            key={id}
            id={id as string}
            className="cursor-pointer w-full rounded-lg outline outline-transparent duration-300 ease-in-out overflow-hidden hover:outline-green-300 xl:aspect-7/8"
            onMouseEnter={handle360MouseEnter}
            onMouseLeave={handle360MouseLeave}
            onMouseMove={handle360MouseMove}
            onClick={onClick}>
            <Image
              className="w-full object-cover rounded-lg duration-300 ease-in-out scale-[1.2]"
              style={activeImage.current === id.toString() ? dynamicStyle : {}}
              src={url}
              alt={description}
              width={300}
              height={150}
              priority
            />
          </div>
        ))}
      </div>
    </main>
  );
}
