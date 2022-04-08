import { writable, type Writable } from "svelte/store";

export const running: Writable<boolean> = writable(false);
export const points: Writable<number> = writable(0);
export const mistakesTotal: Writable<number> = writable(0);
export const mistakesCorrected: Writable<number> = writable(0);
export const elapsedTime: Writable<number> = writable(0);