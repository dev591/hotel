"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { easing } from "maath";
import { Vector3 } from "three";
import { useExperience } from "./store";
import { scrollPositions, scrollTargets } from "./shots";

// Read by scene objects (gate, doors) every frame without causing React re-renders.
export const scrollProgress = { value: 0 };

const desiredPos = new Vector3();
const desiredLook = new Vector3();

export default function CameraRig() {
  const scroll = useScroll();
  const look = useRef(scrollTargets.getPointAt(0));

  useFrame((state, delta) => {
    const { phase, shot, snap, consumeSnap, enterLobby } =
      useExperience.getState();
    const camera = state.camera;

    if (phase === "intro") {
      const o = scroll.offset;
      scrollProgress.value = o;
      scrollPositions.getPointAt(Math.min(o, 1), desiredPos);
      scrollTargets.getPointAt(Math.min(o, 1), desiredLook);
      if (o > 0.985) enterLobby();
    } else if (shot) {
      desiredPos.copy(shot.position);
      desiredLook.copy(shot.target);
    }

    if (phase !== "booking" && phase !== "confirmed") {
      desiredLook.x += state.pointer.x * 0.35;
      desiredLook.y += state.pointer.y * 0.2;
    }

    if (snap) {
      camera.position.copy(desiredPos);
      look.current.copy(desiredLook);
      consumeSnap();
    } else {
      const smooth = phase === "intro" ? 0.35 : 0.9;
      easing.damp3(camera.position, desiredPos, smooth, delta);
      easing.damp3(look.current, desiredLook, smooth * 0.8, delta);
    }

    camera.lookAt(look.current);
  });

  return null;
}
