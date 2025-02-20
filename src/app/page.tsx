"use client";
import Image from "next/image";
import { Key, useEffect, useState } from "react";

interface ImageI {
  id: Key;
  url: string;
  description: string;
}

export default function Home() {
  const [images, setImages] = useState<ImageI[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-dashed border-gray-300 rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }
  return (
    <main>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images.map((image) => (
          <div key={image.id} className="group cursor-pointer">
            <Image
              className="w-full rounded-lg bg-gray-200 object-cover outline duration-300 ease-in-out group-hover:outline-green-300 xl:aspect-7/8"
              src={image.url}
              alt={image.description}
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
