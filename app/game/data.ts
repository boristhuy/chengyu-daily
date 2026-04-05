import rawDataset from "./dataset.json";
import type { ChengyuEntry } from "./types";

export const CHENGYU_DATASET: ChengyuEntry[] = rawDataset;

function splitCharacters(value: string): string[] {
  return Array.from(value);
}

function hasDistinctCharacters(value: string): boolean {
  const characters = splitCharacters(value);
  return new Set(characters).size === characters.length;
}

function hasDistinctItems(values: string[]): boolean {
  return new Set(values).size === values.length;
}

function validateDataset(dataset: ChengyuEntry[]): void {
  if (dataset.length === 0) {
    throw new Error("Dataset must contain at least one entry.");
  }

  for (const entry of dataset) {
    const characters = splitCharacters(entry.hanzi);
    const distractorCharacters = entry.distractors;
    const poolSize = characters.length + distractorCharacters.length;

    if (characters.length !== 4) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": expected exactly 4 characters.`);
    }

    if (!hasDistinctCharacters(entry.hanzi)) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": characters must be distinct for MVP.`);
    }

    if (!entry.pinyin.trim()) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": pinyin is required.`);
    }

    if (!entry.meaning.trim()) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": meaning is required.`);
    }

    if (entry.examples.length === 0 || entry.examples.some((example) => !example.trim())) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": at least one example is required.`);
    }

    if (distractorCharacters.length < 4 || distractorCharacters.length > 6) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": expected 4 to 6 distractors.`);
    }

    if (distractorCharacters.some((character) => character.trim().length !== 1)) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": distractors must be single characters.`);
    }

    if (!hasDistinctItems(distractorCharacters)) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": distractors must be distinct.`);
    }

    if (distractorCharacters.some((character) => characters.includes(character))) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": distractors must not be part of the answer.`);
    }

    if (poolSize < 8 || poolSize > 10) {
      throw new Error(`Invalid chengyu "${entry.hanzi}": pool must contain 8 to 10 characters.`);
    }
  }
}

validateDataset(CHENGYU_DATASET);
