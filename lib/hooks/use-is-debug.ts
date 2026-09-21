"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getDebugSnapshot(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return new URLSearchParams(window.location.search).get("debug") === "1";
}

function getServerSnapshot(): boolean {
  return false;
}

export function useIsDebug(): boolean {
  return useSyncExternalStore(subscribe, getDebugSnapshot, getServerSnapshot);
}

function getMountedSnapshot(): boolean {
  return true;
}

function getMountedServerSnapshot(): boolean {
  return false;
}

export function useIsMounted(): boolean {
  return useSyncExternalStore(subscribe, getMountedSnapshot, getMountedServerSnapshot);
}
