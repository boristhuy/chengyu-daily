import type { ChengyuEntry } from "./types";

export const CHENGYU_DATASET: ChengyuEntry[] = [
  {
    hanzi: "画蛇添足",
    pinyin: "hua she tian zu",
    meaning: "To ruin something by adding unnecessary details.",
    examples: ["这个方案已经很清楚了，别再画蛇添足地加功能。"],
  },
  {
    hanzi: "盲人摸象",
    pinyin: "mang ren mo xiang",
    meaning: "To mistake a part for the whole because of limited perspective.",
    examples: ["只看一组数据就下结论，难免像盲人摸象。"],
  },
  {
    hanzi: "对牛弹琴",
    pinyin: "dui niu tan qin",
    meaning: "To address the wrong audience and be misunderstood.",
    examples: ["跟完全不感兴趣的人讲这些术语，简直是对牛弹琴。"],
  },
  {
    hanzi: "守株待兔",
    pinyin: "shou zhu dai tu",
    meaning: "To wait passively for luck instead of taking action.",
    examples: ["市场不会自己来，守株待兔是拿不到客户的。"],
  },
  {
    hanzi: "刻舟求剑",
    pinyin: "ke zhou qiu jian",
    meaning: "To rely on outdated methods without adapting to change.",
    examples: ["环境早就变了，还按老办法做事，无异于刻舟求剑。"],
  },
  {
    hanzi: "亡羊补牢",
    pinyin: "wang yang bu lao",
    meaning: "To take corrective action after a problem appears; better late than never.",
    examples: ["出了问题后马上补上流程，也算亡羊补牢。"],
  },
  {
    hanzi: "班门弄斧",
    pinyin: "ban men nong fu",
    meaning: "To show off a skill in front of an expert.",
    examples: ["在老师傅面前讲这点经验，有点班门弄斧。"],
  },
  {
    hanzi: "滥竽充数",
    pinyin: "lan yu chong shu",
    meaning: "To fake competence and blend in without real ability.",
    examples: ["不会做还装懂，只是在团队里滥竽充数。"],
  },
];

function splitCharacters(value: string): string[] {
  return Array.from(value);
}

function hasDistinctCharacters(value: string): boolean {
  const characters = splitCharacters(value);
  return new Set(characters).size === characters.length;
}

function validateDataset(dataset: ChengyuEntry[]): void {
  for (const entry of dataset) {
    const characters = splitCharacters(entry.hanzi);

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
  }
}

validateDataset(CHENGYU_DATASET);
