export type Chengyu = string;

export interface ChengyuEntry {
  hanzi: Chengyu;
  pinyin: string;
  meaning: string;
  examples: string[];
}

export type GuessFeedbackStatus = "correct" | "present" | "absent";

export interface GuessFeedback {
  character: string;
  index: number;
  status: GuessFeedbackStatus;
}

export interface GuessResult {
  guess: string;
  feedback: GuessFeedback[];
  isCorrect: boolean;
  attemptNumber: number;
}

export interface Puzzle {
  target: Chengyu;
  learning: ChengyuEntry;
  pool: string[];
  attemptCount: number;
  guesses: GuessResult[];
  isSolved: boolean;
  isFailed: boolean;
}

export interface SubmitGuessSuccess {
  ok: true;
  puzzle: Puzzle;
  result: GuessResult;
}

export interface SubmitGuessError {
  ok: false;
  error: string;
}

export type SubmitGuessResult = SubmitGuessSuccess | SubmitGuessError;
