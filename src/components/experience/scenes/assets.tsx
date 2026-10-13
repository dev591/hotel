"use client";

import { useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import {
  Box3,
  Mesh,
  Object3D,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  Vector3,
} from "three";

type GroupProps = Omit<ThreeElements["group"], "id">;

export const modelUrl = (id: string) => `/m/${id}.glb`;
export const DISPLAY_FONT = "/fonts/Fraunces.ttf";

// Draco off (its decoder loads from a CDN); meshopt decoder is bundled locally.
const useModel = (id: string) => useGLTF(modelUrl(id), false, true);

function prepare(scene: Object3D, height?: number, width?: number) {
  const object = scene.clone(true);
  object.traverse((o) => {
    if ((o as Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  object.updateMatrixWorld(true);
  const box = new Box3().setFromObject(object);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  let s = 1;
  if (height) s = height / size.y;
  else if (width) s = width / Math.max(size.x, size.z);
  return {
    object,
    scale: s,
    offset: new Vector3(-center.x * s, -box.min.y * s, -center.z * s),
  };
}

export function Model({
  id,
  height,
  width,
  ...props
}: { id: string; height?: number; width?: number } & GroupProps) {
  const { scene } = useModel(id);
  const { object, scale, offset } = useMemo(
    () => prepare(scene, height, width),
    [scene, height, width],
  );

  return (
    <group {...props}>
      <group position={offset} scale={scale}>
        <primitive object={object} />
      </group>
    </group>
  );
}

export type Leaf = { name: string; hinge: "min" | "max" };

export function HingedModel({
  id,
  height,
  width,
  leaves,
  hide,
  maxAngle,
  openAmount,
  ...props
}: {
  id: string;
  height?: number;
  width?: number;
  leaves: Leaf[];
  hide?: string;
  maxAngle: number;
  openAmount: () => number;
} & GroupProps) {
  const { scene } = useModel(id);

  const { object, scale, offset, pivots } = useMemo(() => {
    const prepared = prepare(scene, height, width);
    const pivots: { pivot: Object3D; dir: number }[] = [];
    if (hide) {
      const hidden = prepared.object.getObjectByName(hide);
      if (hidden) hidden.visible = false;
    }
    for (const leaf of leaves) {
      const node = prepared.object.getObjectByName(leaf.name);
      if (!node?.parent) continue;
      const box = new Box3().setFromObject(node);
      const pivot = new Object3D();
      pivot.position.set(
        leaf.hinge === "min" ? box.min.x : box.max.x,
        0,
        (box.min.z + box.max.z) / 2,
      );
      node.parent.add(pivot);
      pivot.updateMatrixWorld(true);
      pivot.attach(node);
      pivots.push({ pivot, dir: leaf.hinge === "min" ? 1 : -1 });
    }
    return { ...prepared, pivots };
  }, [scene, height, width, leaves, hide]);

  useFrame(() => {
    const a = openAmount() * maxAngle;
    // eslint-disable-next-line react-hooks/immutability -- three.js objects are mutated per frame by design
    for (const { pivot, dir } of pivots) pivot.rotation.y = dir * a;
  });

  return (
    <group {...props}>
      <group position={offset} scale={scale}>
        <primitive object={object} />
      </group>
    </group>
  );
}

export function usePBR(id: string, repeatX: number, repeatY = repeatX) {
  const base = useTexture({
    map: `/textures/${id}/diff.jpg`,
    normalMap: `/textures/${id}/nor.jpg`,
    arm: `/textures/${id}/arm.jpg`,
  });

  return useMemo(() => {
    const prep = (t: Texture, color = false) => {
      const c = t.clone();
      c.wrapS = c.wrapT = RepeatWrapping;
      c.repeat.set(repeatX, repeatY);
      c.anisotropy = 8;
      if (color) c.colorSpace = SRGBColorSpace;
      c.needsUpdate = true;
      return c;
    };
    const arm = prep(base.arm);
    return {
      map: prep(base.map, true),
      normalMap: prep(base.normalMap),
      roughnessMap: arm,
      aoMap: arm,
    };
  }, [base, repeatX, repeatY]);
}
