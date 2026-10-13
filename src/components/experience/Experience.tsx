"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  PerformanceMonitor,
  Scroll,
  ScrollControls,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  N8AO,
  Noise,
  SMAA,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { NoToneMapping } from "three";
import type { RoomDTO } from "@/lib/types";
import { useExperience } from "./store";
import CameraRig from "./CameraRig";
import Exterior from "./scenes/Exterior";
import Lobby from "./scenes/Lobby";
import Corridor from "./scenes/Corridor";
import RoomInterior from "./scenes/RoomInterior";
import { modelUrl } from "./scenes/assets";
import Overlays from "./ui/Overlays";
import Loader from "./ui/Loader";
import IntroTitles from "./ui/IntroTitles";

const MODELS = [
  "large_iron_gate", "large_castle_door", "street_lamp_01", "jacaranda_tree",
  "island_tree_01", "wild_rooibos_bush", "planter_box_01", "horse_statue_01",
  "Lantern_01", "Chandelier_01", "ClassicConsole_01", "Sofa_01", "ArmChair_01",
  "coffee_table_round_01", "ornate_mirror_01", "fancy_picture_frame_01",
  "potted_plant_02", "potted_plant_04", "brass_vase_01", "GothicBed_01",
  "ClassicNightstand_01", "Chandelier_03", "sofa_02", "modern_arm_chair_01",
  "dining_table", "Ottoman_01", "fancy_picture_frame_02",
];
const TEXTURES = [
  "marble_tiles", "white_sandstone_bricks", "cobblestone_floor_01",
  "grass_ground", "white_plaster_02", "herringbone_parquet",
];
MODELS.forEach((id) => useGLTF.preload(modelUrl(id), false, true));
TEXTURES.forEach((id) =>
  ["diff", "nor", "arm"].forEach((m) => useTexture.preload(`/textures/${id}/${m}.jpg`)),
);

function World() {
  const location = useExperience((s) => s.location);
  // Only the current set is mounted so its lights don't add shader cost elsewhere;
  // swaps happen during a black fade, hiding the shader recompile.
  if (location === "corridor") return <Corridor />;
  if (location === "room") return <RoomInterior />;
  return (
    <>
      <Exterior />
      <Lobby />
    </>
  );
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#ffd9b0", "#2a3a22", 0.35]} />
      <directionalLight
        position={[-38, 20, 34]}
        color="#ffb27a"
        intensity={2.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-far={150}
      />
    </>
  );
}

function Grade() {
  return (
    <>
      <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.25} intensity={0.6} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette offset={0.3} darkness={0.5} />
      <Noise premultiply opacity={0.05} blendFunction={BlendFunction.SOFT_LIGHT} />
      <SMAA />
    </>
  );
}

// Only toggles the post-processing tier; never touches canvas DPR (that disrupts ScrollControls).
function QualityMonitor() {
  const setHigh = useExperience((s) => s.setHighQuality);
  return (
    <PerformanceMonitor
      bounds={() => [32, 55]}
      flipflops={3}
      onDecline={() => setHigh(false)}
      onIncline={() => setHigh(true)}
      onFallback={() => setHigh(false)}
    />
  );
}

function Effects() {
  const high = useExperience((s) => s.highQuality);
  return high ? (
    <EffectComposer key="high" multisampling={0}>
      <N8AO halfRes aoRadius={0.9} intensity={1.6} distanceFalloff={0.5} />
      <Grade />
    </EffectComposer>
  ) : (
    <EffectComposer key="low" multisampling={0}>
      <Grade />
    </EffectComposer>
  );
}

export default function Experience({ rooms }: { rooms: RoomDTO[] }) {
  const setRooms = useExperience((s) => s.setRooms);
  const phase = useExperience((s) => s.phase);

  useEffect(() => setRooms(rooms), [rooms, setRooms]);

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: false, toneMapping: NoToneMapping, powerPreference: "high-performance" }}
        camera={{ fov: 40, near: 0.1, far: 500, position: [0, 2.4, 36] }}
      >
        <color attach="background" args={["#0b0907"]} />
        <fog attach="fog" args={["#c79a72", 40, 190]} />
        <Suspense fallback={null}>
          <Environment
            files="/hdri/belfast_sunset_puresky.hdr"
            background
            backgroundIntensity={0.9}
            environmentIntensity={0.55}
          />
          <Lights />
          <ScrollControls pages={7} damping={0.3} enabled={phase === "intro"}>
            <CameraRig />
            <World />
            <Scroll html style={{ width: "100%" }}>
              <IntroTitles />
            </Scroll>
          </ScrollControls>
          <Effects />
        </Suspense>
        <QualityMonitor />
              </Canvas>
      <Overlays />
      <Loader />
    </div>
  );
}
