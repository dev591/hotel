"use client";

import { useMemo } from "react";
import { Instance, Instances } from "@react-three/drei";
import { MathUtils } from "three";
import { HingedModel, Model, usePBR, type Leaf } from "./assets";
import { scrollProgress } from "../CameraRig";
import { LOBBY } from "../shots";

const ease = (v: number, a: number, b: number) =>
  MathUtils.smoothstep(MathUtils.clamp((v - a) / (b - a), 0, 1), 0, 1);

const GATE_Z = 20;
const FOUNTAIN_Z = -1.5;
const FACADE = { width: 46, height: 17, doorW: 3.7, doorH: 5.4 };

function Ground() {
  const grass = usePBR("grass_ground", 60);
  const stone = usePBR("cobblestone_floor_01", 3, 20);
  const plaza = usePBR("cobblestone_floor_01", 6);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial {...grass} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 4]} receiveShadow>
        <planeGeometry args={[7, 68]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, FOUNTAIN_Z]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial {...plaza} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, -26]} receiveShadow>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial {...plaza} />
      </mesh>
    </group>
  );
}

function Pillar({ x }: { x: number }) {
  const brick = usePBR("white_sandstone_bricks", 1, 4);
  return (
    <group position={[x, 0, GATE_Z]}>
      <mesh position={[0, 3.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 6.8, 1.2]} />
        <meshStandardMaterial {...brick} />
      </mesh>
      <mesh position={[0, 6.95, 0]} castShadow>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial color="#e8dcc4" roughness={0.6} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.25} />
      </mesh>
      <Model id="Lantern_01" height={0.9} position={[0, 4.4, 0.75]} />
      <pointLight position={[0, 4.7, 1.1]} color="#ffb766" intensity={6} distance={9} />
    </group>
  );
}

function BoundaryWall({ from, to }: { from: number; to: number }) {
  const len = Math.abs(to - from);
  const brick = usePBR("white_sandstone_bricks", len / 3, 1.2);
  return (
    <group position={[(from + to) / 2, 0, GATE_Z]}>
      <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[len, 3.4, 0.7]} />
        <meshStandardMaterial {...brick} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[len, 0.22, 0.95]} />
        <meshStandardMaterial color="#e8dcc4" roughness={0.6} />
      </mesh>
    </group>
  );
}

const GATE_LEAVES: Leaf[] = [
  { name: "large_iron_gate_left_door", hinge: "min" },
  { name: "large_iron_gate_right_door", hinge: "max" },
];
const DOOR_LEAVES: Leaf[] = [
  { name: "large_castle_door_left", hinge: "min" },
  { name: "large_castle_door_right", hinge: "max" },
];
const gateOpen = () => ease(scrollProgress.value, 0.03, 0.2);
const doorOpen = () => ease(scrollProgress.value, 0.6, 0.78);

function Gate() {
  return (
    <HingedModel
      id="large_iron_gate"
      width={6}
      leaves={GATE_LEAVES}
      hide="large_iron_gate_bolt"
      maxAngle={1.5}
      openAmount={gateOpen}
      position={[0, 0, GATE_Z]}
    />
  );
}

function Fountain() {
  const stone = usePBR("white_sandstone_bricks", 4, 0.6);
  return (
    <group position={[0, 0, FOUNTAIN_Z]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.4, 3.6, 0.7, 64, 1, true]} />
        <meshStandardMaterial {...stone} side={2} />
      </mesh>
      <mesh position={[0, 0.72, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[3.15, 3.55, 64]} />
        <meshStandardMaterial color="#e8dcc4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[3.35, 64]} />
        <meshPhysicalMaterial
          color="#1d4f5a"
          roughness={0.05}
          metalness={0.1}
          clearcoat={1}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.9, 1.4, 32]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <Model id="horse_statue_01" height={2.4} position={[0, 1.8, 0]} rotation-y={Math.PI / 2} />
      <pointLight position={[0, 1.2, 0]} color="#7fd3e0" intensity={4} distance={7} />
    </group>
  );
}

function Cypresses() {
  const positions = useMemo(() => {
    const p: [number, number, number][] = [];
    for (let x = 6; x <= 38; x += 3.2) {
      p.push([x, 0, GATE_Z - 2.2], [-x, 0, GATE_Z - 2.2]);
    }
    for (let z = 12; z >= -22; z -= 5) {
      p.push([11.5, 0, z], [-11.5, 0, z]);
    }
    return p;
  }, []);

  return (
    <Instances limit={positions.length} castShadow receiveShadow>
      <capsuleGeometry args={[0.85, 5, 8, 16]} />
      <meshStandardMaterial color="#25402a" roughness={0.95} />
      {positions.map((pos, i) => (
        <Instance key={i} position={[pos[0], 3.3, pos[2]]} scale={[1, 1 + (i % 3) * 0.12, 1]} />
      ))}
    </Instances>
  );
}

function Vegetation() {
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s}>
          <Model id="jacaranda_tree" height={9} position={[s * 9, 0, 11]} rotation-y={s} />
          <Model id="jacaranda_tree" height={10} position={[s * 9.5, 0, -16]} rotation-y={-s} />
          <Model id="island_tree_01" height={11} position={[s * 18, 0, -2]} />
          {[14, 6, -10, -20].map((z) => (
            <Model key={z} id="wild_rooibos_bush" height={1.1} position={[s * 4.6, 0, z]} />
          ))}
          <Model id="planter_box_01" height={1} position={[s * 6.2, 0, -25]} />
        </group>
      ))}
    </group>
  );
}

function StreetLamps() {
  const zs = [13, -9, -20];
  return (
    <group>
      {zs.map((z) =>
        [-1, 1].map((s) => (
          <group key={`${z}${s}`} position={[s * 4.2, 0, z]}>
            <Model id="street_lamp_01" height={4.6} rotation-y={s > 0 ? Math.PI : 0} />
            <pointLight position={[0, 4.2, 0]} color="#ffbf73" intensity={10} distance={12} />
          </group>
        )),
      )}
    </group>
  );
}

function Facade() {
  const z = LOBBY.zFront;
  const { width, height, doorW, doorH } = FACADE;
  const side = (width - doorW) / 2;
  const brickSide = usePBR("white_sandstone_bricks", side / 3, height / 3);
  const brickTop = usePBR("white_sandstone_bricks", doorW / 3, (height - doorH) / 3);
  const plaster = usePBR("white_plaster_02", 1, 3);

  const windows = useMemo(() => {
    const w: [number, number][] = [];
    for (const y of [3.2, 7.4, 11, 14.4]) {
      for (let x = -20; x <= 20; x += 3.4) {
        if (Math.abs(x) < 4.5 && y < 8) continue;
        w.push([x, y]);
      }
    }
    return w;
  }, []);

  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (doorW / 2 + side / 2), height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[side, height, 1]} />
          <meshStandardMaterial {...brickSide} />
        </mesh>
      ))}
      <mesh position={[0, doorH + (height - doorH) / 2, 0]} castShadow>
        <boxGeometry args={[doorW, height - doorH, 1]} />
        <meshStandardMaterial {...brickTop} />
      </mesh>
      <mesh position={[0, height + 0.35, 0.2]} castShadow>
        <boxGeometry args={[width + 1, 0.7, 1.6]} />
        <meshStandardMaterial color="#e8dcc4" roughness={0.55} />
      </mesh>

      {windows.map(([x, y]) => (
        <group key={`${x}-${y}`} position={[x, y, 0.52]}>
          <mesh>
            <planeGeometry args={[1.5, 2.1]} />
            <meshStandardMaterial color="#2a1a0c" emissive="#ffb35c" emissiveIntensity={(x * y) % 3 > 1 ? 1.6 : 0.5} />
          </mesh>
          <mesh position={[0, -1.15, 0.08]}>
            <boxGeometry args={[1.8, 0.14, 0.3]} />
            <meshStandardMaterial color="#e8dcc4" />
          </mesh>
        </group>
      ))}

      <group position={[0, 0, 3.4]}>
        {[-6.5, -2.9, 2.9, 6.5].map((x) => (
          <mesh key={x} position={[x, 3.3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.5, 6.6, 32]} />
            <meshStandardMaterial {...plaster} />
          </mesh>
        ))}
        <mesh position={[0, 6.9, -0.6]} castShadow>
          <boxGeometry args={[15.5, 0.8, 4.4]} />
          <meshStandardMaterial color="#e8dcc4" roughness={0.55} />
        </mesh>
        <mesh position={[0, 7.5, 1.4]}>
          <boxGeometry args={[6, 0.6, 0.1]} />
          <meshStandardMaterial color="#c8a96a" metalness={1} roughness={0.3} />
        </mesh>
      </group>

      <HingedModel
        id="large_castle_door"
        height={doorH}
        leaves={DOOR_LEAVES}
        maxAngle={1.4}
        openAmount={doorOpen}
        position={[0, 0, 0.05]}
      />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 3.2, 2.8, 0.75]}>
          <Model id="Lantern_01" height={0.8} />
          <pointLight position={[0, 0.4, 0.4]} color="#ffb766" intensity={6} distance={8} />
        </group>
      ))}
      <pointLight position={[0, 3, 3]} color="#ffd29a" intensity={14} distance={14} />
    </group>
  );
}

export default function Exterior() {
  return (
    <group>
      <Ground />
      <BoundaryWall from={-3.6} to={-42} />
      <BoundaryWall from={3.6} to={42} />
      <Pillar x={-3.6} />
      <Pillar x={3.6} />
      <Gate />
      <Fountain />
      <Cypresses />
      <Vegetation />
      <StreetLamps />
      <Facade />
    </group>
  );
}
