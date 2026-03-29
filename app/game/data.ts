import type { Chengyu } from "./types";

export const CHENGYU_DATASET: Chengyu[] = [
  "画蛇添足",
  "盲人摸象",
  "对牛弹琴",
  "守株待兔",
  "刻舟求剑",
  "亡羊补牢",
  "班门弄斧",
  "滥竽充数",
];

function splitCharacters(value: string): string[] {
  return Array.from(value);
}

function hasDistinctCharacters(value: string): boolean {
  const characters = splitCharacters(value);
  return new Set(characters).size === characters.length;
}

function validateDataset(dataset: Chengyu[]): void {
  for (const chengyu of dataset) {
    const characters = splitCharacters(chengyu);

    if (characters.length !== 4) {
      throw new Error(`Invalid chengyu "${chengyu}": expected exactly 4 characters.`);
    }

    if (!hasDistinctCharacters(chengyu)) {
      throw new Error(`Invalid chengyu "${chengyu}": characters must be distinct for MVP.`);
    }
  }
}

validateDataset(CHENGYU_DATASET);
