export type Chengyu = string;

export type FeedbackColor = "green" | "orange" | "red";

export interface GuessFeedback {
  character: string;
  index: number;
  color: FeedbackColor;
}

export interface GuessResult {
  guess: string;
  feedback: GuessFeedback[];
  isCorrect: boolean;
  attemptNumber: number;
}

export interface Puzzle {
  target: Chengyu;
  pool: string[];
  attemptCount: number;
  guesses: GuessResult[];
  isSolved: boolean;
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
