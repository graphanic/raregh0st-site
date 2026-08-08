import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HERO_LOGO_STATIONARY_IMG } from "../../data/palette";

const MODEL_URL = "/models/RareGh0st_Logo_WEB_v1.glb";
const CYAN = new THREE.Color("#00e5ff");
const MAGENTA = new THREE.Color("#ff2d7d");

export function InteractiveSkullLogo({ isMobile }) {
  const hostRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || failed) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.body.hasAttribute("data-calm");
    const interactionRoot = host.closest("section") || host.parentElement || host;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.05, 5.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.background = "transparent";
    renderer.domElement.style.pointerEvents = "none";
    host.appendChild(renderer.domElement);

    // Brighter, layered lighting so the neutral metal keeps its detail without
    // losing the cyan/magenta RareGh0st split-light character.
    scene.add(new THREE.HemisphereLight(0xeaf5ff, 0x12070e, 1.15));

    const frontFill = new THREE.PointLight(0xe7efff, 12, 9, 2);
    frontFill.position.set(0, 0.25, 3.6);
    scene.add(frontFill);

    const cyanLight = new THREE.PointLight(CYAN, 34, 10, 2);
    cyanLight.position.set(-2.25, 1.05, 2.5);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(MAGENTA, 32, 10, 2);
    magentaLight.position.set(2.25, 0.85, 2.35);
    scene.add(magentaLight);

    const rim = new THREE.PointLight(0xffffff, 18, 8, 2);
    rim.position.set(0, 2.7, -1.5);
    scene.add(rim);

    const rig = new THREE.Group();
    rig.position.y = -0.26;
    scene.add(rig);

    let alive = true;
    let frame = 0;
    let loadedScene = null;
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let spinRemaining = 0;
    let lastTime = performance.now();

    const fitModel = (object) => {
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      object.position.sub(center);

      // The bridge gives the logo a larger transparent render field. Keep the
      // artifact itself compact while leaving room for exaggerated rotation.
      const targetWorldSize = isMobile ? 1.58 : 1.68;
      const scale = targetWorldSize / Math.max(size.x, size.y, size.z);
      object.scale.setScalar(scale);
      object.updateMatrixWorld(true);
    };

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (!alive) return;
        loadedScene = gltf.scene;
        fitModel(loadedScene);

        loadedScene.traverse((child) => {
          if (!child.isMesh) return;
          child.frustumCulled = false;
          const name = `${child.name} ${child.material?.name || ""}`.toLowerCase();

          if (name.includes("halo")) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0xffffff,
              emissiveIntensity: 2.2,
              metalness: 0.05,
              roughness: 0.12,
            });
          } else if (child.material) {
            child.material = child.material.clone();
            child.material.metalness = Math.max(child.material.metalness ?? 0.75, 0.74);
            child.material.roughness = Math.min(child.material.roughness ?? 0.18, 0.18);

            // Gently lift very dark imported base colours so moving lights reveal
            // the normal-map and surface detail instead of disappearing into black.
            if (child.material.color) {
              child.material.color.lerp(new THREE.Color("#4a5260"), 0.12);
            }

            child.material.needsUpdate = true;
          }
        });

        rig.add(loadedScene);
      },
      undefined,
      () => alive && setFailed(true),
    );

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const onPointerMove = (event) => {
      if (reducedMotion || event.pointerType === "touch") return;

      const rect = interactionRoot.getBoundingClientRect();
      const nx = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      const ny = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);

      // Slightly nonlinear response makes the skull react clearly even near the
      // centre, then opens into a more dramatic turn toward the hero edges.
      const expressiveX = Math.sign(nx) * Math.pow(Math.abs(nx), 0.82);
      const expressiveY = Math.sign(ny) * Math.pow(Math.abs(ny), 0.86);
      const maxYaw = THREE.MathUtils.degToRad(isMobile ? 18 : 30);
      const maxPitch = THREE.MathUtils.degToRad(isMobile ? 10 : 16);
      const maxRoll = THREE.MathUtils.degToRad(isMobile ? 2.5 : 5);

      targetY = expressiveX * maxYaw;
      targetX = expressiveY * maxPitch;
      targetZ = -expressiveX * maxRoll;
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      targetZ = 0;
    };

    const onPointerUp = (event) => {
      if (reducedMotion || spinRemaining > 0.01) return;

      // The canvas itself is click-through so it never blocks hero content.
      // Only trigger the spin when the click lands inside its visual field.
      const rect = host.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (inside) spinRemaining = Math.PI * 2;
    };

    const animate = (now) => {
      if (!alive) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // A little quicker than the first pass, while still carrying enough lag
      // to feel like a weighted object rather than a cursor icon.
      const follow = 1 - Math.exp(-9 * dt);
      const rollFollow = 1 - Math.exp(-7.5 * dt);

      rig.rotation.x = THREE.MathUtils.lerp(rig.rotation.x, targetX, follow);
      rig.rotation.z = THREE.MathUtils.lerp(rig.rotation.z, targetZ, rollFollow);

      if (spinRemaining > 0.001) {
        const step = Math.min(spinRemaining, Math.max(3.2, spinRemaining * 2.8) * dt);
        rig.rotation.y += step;
        spinRemaining -= step;
      } else {
        spinRemaining = 0;
        const nearestTurn = Math.round((rig.rotation.y - targetY) / (Math.PI * 2)) * Math.PI * 2 + targetY;
        rig.rotation.y = THREE.MathUtils.lerp(rig.rotation.y, nearestTurn, follow);
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    interactionRoot.addEventListener("pointermove", onPointerMove);
    interactionRoot.addEventListener("pointerleave", onPointerLeave);
    interactionRoot.addEventListener("pointerup", onPointerUp);
    frame = requestAnimationFrame(animate);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      interactionRoot.removeEventListener("pointermove", onPointerMove);
      interactionRoot.removeEventListener("pointerleave", onPointerLeave);
      interactionRoot.removeEventListener("pointerup", onPointerUp);

      if (loadedScene) {
        loadedScene.traverse((child) => {
          if (!child.isMesh) return;
          child.geometry?.dispose?.();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material?.dispose?.());
        });
      }

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [failed, isMobile]);

  if (failed) {
    return (
      <img
        src={HERO_LOGO_STATIONARY_IMG}
        alt="1RareGh0st"
        draggable="false"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    );
  }

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="Interactive 3D 1RareGh0st skull logo. Move the pointer to look around; click to spin."
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        pointerEvents: "none",
      }}
    />
  );
}
