"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

interface DynamicMapProps {
  children?: ReactNode;
  center: [number, number];
  className?: string;
  zoom?: number;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
  attributionControl?: boolean;
}

const DynamicMap = dynamic(() => import("./map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function NextjsMap(props: DynamicMapProps) {
  return (
    <DynamicMap
      center={props.center}
      className={props.className}
      zoom={props.zoom}
      scrollWheelZoom={props.scrollWheelZoom}
      doubleClickZoom={props.doubleClickZoom}
      attributionControl={props.attributionControl}
    >
      {props.children}
    </DynamicMap>
  );
}
