"use client";

import {
  Component,
  type ReactNode,
  type RefObject,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Bounds,
  Html,
  OrbitControls,
  Preload,
  useBounds,
  useGLTF,
} from "@react-three/drei";
import type { Material, Mesh } from "three";
import { Loader2, RefreshCcw, Sun, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

type LightingPreset = "studio" | "sunset";

type ModelViewerProps = {
  modelUrl: string;
  title: string;
  sizeMb?: number;
};

type CanvasErrorBoundaryState = {
  hasError: boolean;
};

class CanvasErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    return;
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function BoundsController({ resetSignal }: { resetSignal: number }) {
  const bounds = useBounds();

  useEffect(() => {
    bounds.refresh().clip().fit();
  }, [bounds, resetSignal]);

  return null;
}

function AssetModel({ modelUrl, wireframe }: { modelUrl: string; wireframe: boolean }) {
  const gltf = useGLTF(modelUrl, "https://www.gstatic.com/draco/versioned/decoders/1.5.5/");

  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);

    clonedScene.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || !mesh.material) return;

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => m.clone());
      } else {
        mesh.material = mesh.material.clone();
      }
    });

    return clonedScene;
  }, [gltf.scene]);

  // Cleanup effect to help GC
  useEffect(() => {
    return () => {
      scene.traverse((object) => {
        const mesh = object as Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || !mesh.material) return;

      const applyWireframe = (material: Material) => {
        if ("wireframe" in material) {
          (material as Material & { wireframe: boolean }).wireframe = wireframe;
          material.needsUpdate = true;
        }
      };

      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => applyWireframe(material));
      } else {
        applyWireframe(mesh.material);
      }
    });
  }, [scene, wireframe]);

  return <primitive object={scene} />;
}

function StageLights({ preset }: { preset: LightingPreset }) {
  if (preset === "sunset") {
    return (
      <>
        <color attach="background" args={["#0f1118"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 8, 4]} intensity={2.1} color="#ffd6aa" />
        <directionalLight position={[-5, 3, -5]} intensity={0.8} color="#8ed8ff" />
      </>
    );
  }

  return (
    <>
      <color attach="background" args={["#0b1018"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[6, 6, 3]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-6, 2, -4]} intensity={0.8} color="#b7d4ff" />
    </>
  );
}

function LoadingFallback({ sizeMb }: { sizeMb?: number }) {
  return (
    <Html center>
      <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/80 px-4 py-3 text-sm font-medium text-cyan-50 shadow-xl backdrop-blur-md">
        <Loader2 className="size-4 animate-spin text-cyan-300" />
        <div className="flex flex-col leading-tight">
          <span className="tracking-wide">Optimizing 3D Model...</span>
          {sizeMb !== undefined && (
            <span className="text-xs text-zinc-400">{sizeMb} MB</span>
          )}
        </div>
      </div>
    </Html>
  );
}

function ViewerUnavailable({ title }: { title: string }) {
  return (
    <div className="flex min-h-[340px] items-center justify-center rounded-xl border border-dashed border-white/25 bg-zinc-950/80 p-5 text-center text-sm text-zinc-300">
      <div className="max-w-sm space-y-2">
        <p className="font-medium text-zinc-100">3D viewer tidak dapat ditampilkan.</p>
        <p>
          Device/browser saat ini belum mendukung WebGL untuk menampilkan model {title}. Coba
          browser modern terbaru di desktop.
        </p>
      </div>
    </div>
  );
}

function checkWebGLAvailability(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export function ModelViewer({ modelUrl, title, sizeMb }: ModelViewerProps) {
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>("studio");
  const [wireframe, setWireframe] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [webGLSupported] = useState(checkWebGLAvailability);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    useGLTF.preload(modelUrl, "https://www.gstatic.com/draco/versioned/decoders/1.5.5/");
  }, [modelUrl]);

  if (!mounted) {
    return (
      <div className="h-[340px] w-full animate-pulse rounded-xl bg-zinc-900/50 sm:h-[460px]" />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950/70 p-3">
        <div className="inline-flex items-center gap-2 text-xs text-zinc-300">
          <Wrench className="size-3.5 text-cyan-200" />
          Orbit drag . Scroll zoom . Right-click pan
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={lightingPreset === "studio" ? "secondary" : "outline"}
            className="border-white/20 transition-all active:scale-95"
            onClick={() => setLightingPreset("studio")}
          >
            <Sun className="size-3.5" />
            Studio
          </Button>
          <Button
            size="sm"
            variant={lightingPreset === "sunset" ? "secondary" : "outline"}
            className="border-white/20 transition-all active:scale-95"
            onClick={() => setLightingPreset("sunset")}
          >
            <Sun className="size-3.5" />
            Sunset
          </Button>
          <Button
            size="sm"
            variant={wireframe ? "secondary" : "outline"}
            className="border-white/20 transition-all active:scale-95"
            onClick={() => setWireframe((current) => !current)}
          >
            Wireframe
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 transition-all active:scale-95"
            onClick={() => setResetSignal((signal) => signal + 1)}
          >
            <RefreshCcw className="size-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {webGLSupported ? (
        <CanvasErrorBoundary fallback={<ViewerUnavailable title={title} />}>
          <div 
            ref={containerRef}
            className="h-[340px] overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:h-[460px]"
          >
            <Canvas
              camera={{ position: [0, 1.8, 4.5], fov: 42 }}
              dpr={[1, 2]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
              eventSource={containerRef as RefObject<HTMLElement>}
              eventPrefix="client"
            >
              <Suspense fallback={<LoadingFallback sizeMb={sizeMb} />}>
                <StageLights preset={lightingPreset} />
                <Bounds fit clip observe margin={1.2}>
                  <BoundsController resetSignal={resetSignal} />
                  <AssetModel modelUrl={modelUrl} wireframe={wireframe} />
                </Bounds>
                <Preload all />
              </Suspense>
              <OrbitControls
                makeDefault
                enablePan
                enableZoom
                minDistance={0.75}
                maxDistance={20}
                dampingFactor={0.08}
              />
              <AdaptiveDpr pixelated />
              <AdaptiveEvents />
            </Canvas>
          </div>
        </CanvasErrorBoundary>
      ) : (
        <ViewerUnavailable title={title} />
      )}
    </div>
  );
}
