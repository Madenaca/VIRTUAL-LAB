"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Eye, Sparkles } from "lucide-react";

interface Lab3DViewerProps {
  alatId: string;
  nama: string;
  warnaGradien?: string;
  className?: string;
}

export default function Lab3DViewer({
  alatId,
  nama,
  className = "w-full h-80 sm:h-96",
}: Lab3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // References for manual zoom/reset buttons
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clean container before appending
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lights (Studio lighting for glassware)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00b4d8, 1.0);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 1.5, 10);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // 5. Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.4,
      transparent: true,
      opacity: 0.85,
      ior: 1.52,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const liquidMaterial = (colorHex: number) =>
      new THREE.MeshPhysicalMaterial({
        color: colorHex,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.75,
        transparent: true,
        opacity: 0.8,
        ior: 1.33,
      });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25,
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.7,
      roughness: 0.3,
    });

    // 6. Build 3D Equipment Models
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;

    switch (alatId) {
      case "gelas-beker": {
        // Cylindrical glass body
        const bodyGeo = new THREE.CylinderGeometry(1.0, 0.95, 2.2, 48, 1, true);
        const beaker = new THREE.Mesh(bodyGeo, glassMaterial);
        modelGroup.add(beaker);

        // Bottom disc
        const bottomGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.06, 48);
        const bottom = new THREE.Mesh(bottomGeo, glassMaterial);
        bottom.position.y = -1.1;
        modelGroup.add(bottom);

        // Lip rim
        const rimGeo = new THREE.TorusGeometry(1.02, 0.04, 16, 48);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, glassMaterial);
        rim.position.y = 1.1;
        modelGroup.add(rim);

        // Liquid inside
        const liquidGeo = new THREE.CylinderGeometry(0.92, 0.9, 1.4, 32);
        const liquid = new THREE.Mesh(liquidGeo, liquidMaterial(0x00b4d8));
        liquid.position.y = -0.38;
        modelGroup.add(liquid);

        // Meniscus surface
        const surfaceGeo = new THREE.CircleGeometry(0.92, 32);
        surfaceGeo.rotateX(-Math.PI / 2);
        const surface = new THREE.Mesh(surfaceGeo, liquidMaterial(0x0096c7));
        surface.position.y = 0.32;
        modelGroup.add(surface);

        // Graduation rings
        for (let i = -0.6; i <= 0.6; i += 0.3) {
          const ringGeo = new THREE.TorusGeometry(0.98, 0.015, 8, 32);
          ringGeo.rotateX(Math.PI / 2);
          const ring = new THREE.Mesh(
            ringGeo,
            new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.6, transparent: true })
          );
          ring.position.y = i;
          modelGroup.add(ring);
        }
        break;
      }

      case "erlenmeyer": {
        // Conical flask body
        const coneGeo = new THREE.CylinderGeometry(0.4, 1.3, 1.8, 48, 1, true);
        const cone = new THREE.Mesh(coneGeo, glassMaterial);
        cone.position.y = -0.2;
        modelGroup.add(cone);

        // Flask neck
        const neckGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.9, 48, 1, true);
        const neck = new THREE.Mesh(neckGeo, glassMaterial);
        neck.position.y = 1.1;
        modelGroup.add(neck);

        // Rim
        const rimGeo = new THREE.TorusGeometry(0.42, 0.04, 16, 32);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, glassMaterial);
        rim.position.y = 1.55;
        modelGroup.add(rim);

        // Flat bottom
        const bottomGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.06, 48);
        const bottom = new THREE.Mesh(bottomGeo, glassMaterial);
        bottom.position.y = -1.1;
        modelGroup.add(bottom);

        // Fluid inside
        const fluidGeo = new THREE.CylinderGeometry(0.7, 1.25, 1.1, 32);
        const fluid = new THREE.Mesh(fluidGeo, liquidMaterial(0x8338ec));
        fluid.position.y = -0.55;
        modelGroup.add(fluid);
        break;
      }

      case "labu-ukur": {
        // Spherical bottom
        const sphereGeo = new THREE.SphereGeometry(0.9, 32, 24, 0, Math.PI * 2, 0.2, Math.PI * 0.85);
        const sphere = new THREE.Mesh(sphereGeo, glassMaterial);
        sphere.position.y = -0.3;
        modelGroup.add(sphere);

        // Long slender neck
        const neckGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 32, 1, true);
        const neck = new THREE.Mesh(neckGeo, glassMaterial);
        neck.position.y = 1.2;
        modelGroup.add(neck);

        // Stopper cap
        const capGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.35, 24);
        const cap = new THREE.Mesh(capGeo, glassMaterial);
        cap.position.y = 2.2;
        modelGroup.add(cap);

        // Calibration ring (single line)
        const lineGeo = new THREE.TorusGeometry(0.21, 0.015, 8, 32);
        lineGeo.rotateX(Math.PI / 2);
        const line = new THREE.Mesh(lineGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        line.position.y = 1.3;
        modelGroup.add(line);

        // Chemical solution
        const solGeo = new THREE.SphereGeometry(0.85, 24, 16);
        const sol = new THREE.Mesh(solGeo, liquidMaterial(0x3a86ff));
        sol.position.y = -0.3;
        modelGroup.add(sol);
        break;
      }

      case "gelas-ukur": {
        // Hexagonal foot
        const baseGeo = new THREE.CylinderGeometry(0.8, 0.85, 0.15, 6);
        const base = new THREE.Mesh(baseGeo, glassMaterial);
        base.position.y = -1.5;
        modelGroup.add(base);

        // Tall cylinder
        const tubeGeo = new THREE.CylinderGeometry(0.45, 0.45, 2.9, 36, 1, true);
        const tube = new THREE.Mesh(tubeGeo, glassMaterial);
        tube.position.y = 0.0;
        modelGroup.add(tube);

        // Liquid column
        const liqGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.8, 24);
        const liq = new THREE.Mesh(liqGeo, liquidMaterial(0xf59e0b));
        liq.position.y = -0.55;
        modelGroup.add(liq);

        // Measurement ticks
        for (let i = -1.2; i <= 1.2; i += 0.25) {
          const markGeo = new THREE.TorusGeometry(0.46, 0.012, 6, 24);
          markGeo.rotateX(Math.PI / 2);
          const mark = new THREE.Mesh(
            markGeo,
            new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.7, transparent: true })
          );
          mark.position.y = i;
          modelGroup.add(mark);
        }
        break;
      }

      case "bunsen": {
        // Base plate
        const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.18, 36), metalMaterial);
        base.position.y = -1.2;
        modelGroup.add(base);

        // Vertical barrel tube
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.0, 24), metalMaterial);
        barrel.position.y = -0.1;
        modelGroup.add(barrel);

        // Air regulator ring (collar)
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.4, 24), brassMaterial);
        collar.position.y = -0.8;
        modelGroup.add(collar);

        // Gas nipple nozzle
        const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.6, 16), brassMaterial);
        nozzle.rotation.z = Math.PI / 2;
        nozzle.position.set(0.6, -1.0, 0);
        modelGroup.add(nozzle);

        // 3D Flickering Flame (outer blue + inner yellow cone)
        const flameOuterGeo = new THREE.ConeGeometry(0.24, 0.9, 16);
        const flameOuterMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.85,
        });
        const flameOuter = new THREE.Mesh(flameOuterGeo, flameOuterMat);
        flameOuter.position.y = 1.35;
        modelGroup.add(flameOuter);

        const flameInnerGeo = new THREE.ConeGeometry(0.14, 0.6, 16);
        const flameInnerMat = new THREE.MeshBasicMaterial({
          color: 0xfef08a,
          transparent: true,
          opacity: 0.95,
        });
        const flameInner = new THREE.Mesh(flameInnerGeo, flameInnerMat);
        flameInner.position.y = 1.25;
        modelGroup.add(flameInner);

        // Light from flame
        const flameLight = new THREE.PointLight(0x38bdf8, 2, 4);
        flameLight.position.set(0, 1.4, 0);
        modelGroup.add(flameLight);
        break;
      }

      case "tabung-reaksi":
      default: {
        // Test tube cylinder
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.5, 32, 1, true), glassMaterial);
        tube.position.y = 0.2;
        modelGroup.add(tube);

        // Hemispherical bottom
        const bottom = new THREE.Mesh(
          new THREE.SphereGeometry(0.35, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
          glassMaterial
        );
        bottom.position.y = -1.05;
        modelGroup.add(bottom);

        // Flared rim
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.03, 16, 32), glassMaterial);
        rim.rotateX(Math.PI / 2);
        rim.position.y = 1.45;
        modelGroup.add(rim);

        // Chemical solution inside
        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.4, 24), liquidMaterial(0x10b981));
        liquid.position.y = -0.3;
        modelGroup.add(liquid);

        const liquidBottom = new THREE.Mesh(
          new THREE.SphereGeometry(0.32, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
          liquidMaterial(0x10b981)
        );
        liquidBottom.position.y = -1.0;
        modelGroup.add(liquidBottom);
        break;
      }
    }

    scene.add(modelGroup);

    // 7. Interactive Orbit Mouse & Touch Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };

    // Pinch zoom tracking
    let initialTouchDistance = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotationVelocity.y = deltaX * 0.008;
      rotationVelocity.x = deltaY * 0.008;

      modelGroup.rotation.y += rotationVelocity.y;
      modelGroup.rotation.x = Math.max(
        -Math.PI / 4,
        Math.min(Math.PI / 4, modelGroup.rotation.x + rotationVelocity.x)
      );

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Mouse wheel zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.002;
      camera.position.z = Math.max(2.2, Math.min(6.5, camera.position.z + zoomFactor));
    };

    // Touch events for smartphone
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        // Pinch start
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialTouchDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        modelGroup.rotation.y += deltaX * 0.01;
        modelGroup.rotation.x = Math.max(
          -Math.PI / 4,
          Math.min(Math.PI / 4, modelGroup.rotation.x + deltaY * 0.01)
        );

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && initialTouchDistance > 0) {
        // Pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        const diff = initialTouchDistance - currentDistance;

        camera.position.z = Math.max(2.2, Math.min(6.5, camera.position.z + diff * 0.01));
        initialTouchDistance = currentDistance;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      initialTouchDistance = 0;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("wheel", onWheel, { passive: false });

    domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    domElement.addEventListener("touchmove", onTouchMove, { passive: true });
    domElement.addEventListener("touchend", onTouchEnd);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Auto rotation when not dragging
      if (autoRotate && !isDragging && !isHovered) {
        modelGroup.rotation.y += 0.01;
      }

      // Gentle floating animation
      modelGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Window Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("wheel", onWheel);
      domElement.removeEventListener("touchstart", onTouchStart);
      domElement.removeEventListener("touchmove", onTouchMove);
      domElement.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [alatId, autoRotate, isHovered]);

  // Zoom helpers
  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(2.2, cameraRef.current.position.z - 0.5);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(6.5, cameraRef.current.position.z + 0.5);
    }
  };

  const handleReset = () => {
    if (cameraRef.current && modelGroupRef.current) {
      cameraRef.current.position.set(0, 1.2, 4.2);
      cameraRef.current.lookAt(0, 0, 0);
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 border-2 border-slate-700 shadow-2xl flex flex-col justify-between ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Header Badge */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1.5 text-xs text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold">{nama} (3D Model)</span>
        </div>

        <div className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          360° View
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
      />

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-auto">
        <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <Eye className="w-3.5 h-3.5 text-slate-300" />
          <span>Geser untuk putar · Scroll untuk zoom</span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto bg-slate-800/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-lg">
          <button
            onClick={handleZoomIn}
            title="Perbesar (Zoom In)"
            className="w-8 h-8 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            title="Perkecil (Zoom Out)"
            className="w-8 h-8 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Hentikan Putar Otomatis" : "Putar Otomatis"}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors active:scale-95 cursor-pointer ${
              autoRotate
                ? "bg-cyan-600 text-white shadow-sm"
                : "bg-slate-700/80 hover:bg-slate-600 text-slate-200"
            }`}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin-slow" : ""}`} />
          </button>

          <button
            onClick={handleReset}
            title="Reset Posisi Kamera"
            className="w-8 h-8 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
