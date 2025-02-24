import React, { useRef, useEffect, useState } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Loader from "./Loader";

interface PanoramaViewerProps {
  imageUrl: string;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl }) => {
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const controls = useRef<OrbitControls | null>(null);
  const texture = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const firstRenderRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    setIsLoading(true);
    firstRenderRef.current = false;

    const scene = new THREE.Scene();

    camera.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    renderer.current = new THREE.WebGLRenderer({ alpha: true });

    if (renderer.current && container) {
      renderer.current.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.current.domElement);
    }

    const geometry = new THREE.SphereGeometry(500, 60, 40);

    // Create initial material with no texture
    materialRef.current = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });

    const sphere = new THREE.Mesh(geometry, materialRef.current);
    scene.add(sphere);

    const textureLoader = new THREE.TextureLoader();
    texture.current = textureLoader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.mapping = THREE.EquirectangularReflectionMapping;

        if (materialRef.current) {
          materialRef.current.map = loadedTexture;
          materialRef.current.needsUpdate = true;

          const fadeIn = () => {
            if (materialRef.current && materialRef.current.opacity < 1) {
              materialRef.current.opacity += 0.1;
              if (materialRef.current.opacity >= 1) {
                firstRenderRef.current = true;
                setIsLoading(false);
              } else {
                requestAnimationFrame(fadeIn);
              }
            }
          };
          fadeIn();
        }
      },
      undefined,
      () => {
        setIsLoading(false);
      }
    );

    if (camera.current) {
      camera.current.position.set(0, 0, 0.1);
    }

    if (renderer.current && camera.current) {
      controls.current = new OrbitControls(
        camera.current,
        renderer.current.domElement
      );
      controls.current.enableZoom = true;
      controls.current.enablePan = true;
      controls.current.enableDamping = true;
      controls.current.dampingFactor = 0.2;
      controls.current.rotateSpeed = 0.5;
    }

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.0005;
      if (renderer.current && camera.current) {
        renderer.current.render(scene, camera.current);
      }
      controls.current?.update();
    };
    animate();

    const handleResize = () => {
      if (camera.current && renderer.current && container) {
        camera.current.aspect = container.clientWidth / container.clientHeight;
        camera.current.updateProjectionMatrix();
        renderer.current.setSize(container.clientWidth, container.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      while (container && container.firstChild) {
        container.removeChild(container.firstChild);
      }

      window.removeEventListener("resize", handleResize);
      if (renderer.current) {
        renderer.current.dispose();
      }
      if (texture.current) {
        texture.current.dispose();
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
    };
  }, [imageUrl]);

  return (
    <div className="relative w-full h-full">
      {isLoading && <Loader />}
      <div
        className="w-full h-full overflow-hidden cursor-all-scroll"
        ref={containerRef}
      />
    </div>
  );
};

export default PanoramaViewer;
