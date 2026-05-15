"use client";

import { type RefObject, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Center, OrbitControls, Preload, useGLTF } from "@react-three/drei";
import type { Group } from "three";

type ModelPreviewProps = {
  modelUrl: string;
  autoRotate?: boolean;
};

function PreviewModel({
  modelUrl,
  autoRotate = true,
  onLoad,
}: ModelPreviewProps & { onLoad: () => void }) {
  const { scene } = useGLTF(modelUrl, "https://www.gstatic.com/draco/versioned/decoders/1.5.5/");
  const groupRef = useRef<Group>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Signal to parent that model is ready (this runs after Suspense resolves)
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    return () => {
      clonedScene.traverse((object) => {
        const mesh = object as any;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m: any) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [clonedScene]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

export function ModelPreview({ modelUrl, autoRotate = true }: ModelPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleLoad = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full bg-zinc-900/10" />;
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Loading spinner overlay — visible until model signals it is ready */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
          <span className="text-[10px] font-medium text-cyan-400/60 tracking-wide">Loading 3D...</span>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop="always"
        eventSource={containerRef as RefObject<HTMLElement>}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Center top>
            <PreviewModel modelUrl={modelUrl} autoRotate={autoRotate} onLoad={handleLoad} />
          </Center>
          <Preload all />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
