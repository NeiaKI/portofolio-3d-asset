"use client";

import {
  Component,
  type ReactNode,
  type RefObject,
  Suspense,
  useCallback,
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
import { AlertTriangle, Loader2, RefreshCcw, Sun, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { acquireWebGLSlot } from "@/lib/webgl-slots";

type LightingPreset = "studio" | "sunset";

type ModelViewerProps = {
  modelUrl: string;
  title: string;
  sizeMb?: number;
};

class CanvasErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
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

function LoadingFallback({ sizeMb, label }: { sizeMb?: number; label: string }) {
  return (
    <Html center>
      <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-background/90 px-4 py-3 text-sm font-medium text-foreground shadow-xl backdrop-blur-md">
        <Loader2 className="size-4 animate-spin text-cyan-500 dark:text-cyan-300" />
        <div className="flex flex-col leading-tight">
          <span className="tracking-wide">{label}</span>
          {sizeMb !== undefined && (
            <span className="text-xs text-muted-foreground">{sizeMb} MB</span>
          )}
        </div>
      </div>
    </Html>
  );
}

function ViewerUnavailable({ unavailableTitle, unavailableBody }: { unavailableTitle: string; unavailableBody: string }) {
  return (
    <div className="flex min-h-[340px] items-center justify-center rounded-xl border border-dashed border-border bg-card/80 p-5 text-center text-sm text-muted-foreground">
      <div className="max-w-sm space-y-2">
        <p className="font-medium text-foreground">{unavailableTitle}</p>
        <p>{unavailableBody}</p>
      </div>
    </div>
  );
}

function CanvasFailed({ onRetry, retryLabel, failedTitle, failedBody }: {
  onRetry: () => void;
  retryLabel: string;
  failedTitle: string;
  failedBody: string;
}) {
  return (
    <div className="flex min-h-[340px] items-center justify-center rounded-xl border border-dashed border-border bg-card/80 p-5 text-center text-sm text-muted-foreground">
      <div className="max-w-sm space-y-3">
        <AlertTriangle className="mx-auto size-8 text-amber-500" />
        <p className="font-medium text-foreground">{failedTitle}</p>
        <p>{failedBody}</p>
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-1.5">
          <RefreshCcw className="size-3.5" />
          {retryLabel}
        </Button>
      </div>
    </div>
  );
}

function checkWebGLAvailability(): boolean {
  if (typeof window === "undefined") return true;
  return typeof window.WebGLRenderingContext !== "undefined";
}

export function ModelViewer({ modelUrl, title, sizeMb }: ModelViewerProps) {
  const { t } = useI18n();
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>("studio");
  const [wireframe, setWireframe] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [webGLSupported] = useState(checkWebGLAvailability);
  // hasSlot: waiting in the shared WebGL pool before mounting Canvas
  const [hasSlot, setHasSlot] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    useGLTF.preload(modelUrl, "https://www.gstatic.com/draco/versioned/decoders/1.5.5/");
    // Acquire a slot from the shared pool — waits if card previews are still active
    const release = acquireWebGLSlot(() => setHasSlot(true));
    return () => {
      setHasSlot(false);
      release();
    };
  }, [modelUrl]);

  const handleCanvasError = useCallback(() => {
    setCanvasFailed(true);
  }, []);

  const handleRetry = useCallback(() => {
    setCanvasFailed(false);
    setCanvasKey((k) => k + 1);
  }, []);

  if (!hasSlot) {
    return (
      <div className="h-[340px] w-full animate-pulse rounded-xl bg-card/80 sm:h-[460px]" />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Wrench className="size-3.5 text-cyan-500 dark:text-cyan-200" />
          {t("viewer.controls")}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={lightingPreset === "studio" ? "secondary" : "outline"}
            className="border-border transition-all active:scale-95"
            onClick={() => setLightingPreset("studio")}
          >
            <Sun className="size-3.5" />
            {t("viewer.studio")}
          </Button>
          <Button
            size="sm"
            variant={lightingPreset === "sunset" ? "secondary" : "outline"}
            className="border-border transition-all active:scale-95"
            onClick={() => setLightingPreset("sunset")}
          >
            <Sun className="size-3.5" />
            {t("viewer.sunset")}
          </Button>
          <Button
            size="sm"
            variant={wireframe ? "secondary" : "outline"}
            className="border-border transition-all active:scale-95"
            onClick={() => setWireframe((current) => !current)}
          >
            {t("viewer.wireframe")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-border transition-all active:scale-95"
            onClick={() => setResetSignal((signal) => signal + 1)}
          >
            <RefreshCcw className="size-3.5" />
            {t("viewer.reset")}
          </Button>
        </div>
      </div>

      {!webGLSupported ? (
        <ViewerUnavailable
          unavailableTitle={t("viewer.unavailableTitle")}
          unavailableBody={t("viewer.unavailableBody")}
        />
      ) : canvasFailed ? (
        <CanvasFailed
          onRetry={handleRetry}
          retryLabel={t("viewer.retry")}
          failedTitle={t("viewer.failedTitle")}
          failedBody={t("viewer.failedBody")}
        />
      ) : (
        <CanvasErrorBoundary key={canvasKey} onError={handleCanvasError}>
          <div
            ref={containerRef}
            className="h-[340px] overflow-hidden rounded-xl border border-border bg-background/50 sm:h-[460px]"
          >
            <Canvas
              camera={{ position: [0, 1.8, 4.5], fov: 42 }}
              dpr={[1, 2]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
              eventSource={containerRef as RefObject<HTMLElement>}
              eventPrefix="client"
            >
              <Suspense fallback={<LoadingFallback sizeMb={sizeMb} label={t("loading.optimizing")} />}>
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
      )}
    </div>
  );
}
