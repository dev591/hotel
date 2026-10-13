"use client";

import { useEffect, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { RoomDTO } from "@/lib/types";

const Experience = dynamic(() => import("./Experience"), { ssr: false });

const subscribe = () => () => {};

function hasWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

export default function ExperienceLoader({ rooms }: { rooms: RoomDTO[] }) {
  const router = useRouter();
  const supported = useSyncExternalStore(subscribe, hasWebGL2, () => null);

  useEffect(() => {
    if (supported === false) router.replace("/classic");
  }, [supported, router]);

  if (!supported) return <div className="fixed inset-0 bg-[#0b0907]" />;
  return <Experience rooms={rooms} />;
}
