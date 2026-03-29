import { CHENGYU_DATASET } from "./data";
import type {
  Chengyu,
  GuessFeedback,
  GuessResult,
  Puzzle,
  SubmitGuessResult,
} from "./types";

const TARGET_LENGTH = 4;
const MIN_DISTRACTORS = 4;
const MAX_DISTRACTORS = 6;
export const MAX_GUESSES = 6;

function splitCharacters(value: string): string[] {
  return Array.from(value);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function canBuildGuessFromPool(guessCharacters: string[], pool: string[]): boolean {
  return guessCharacters.every((character) => pool.includes(character));
}

function buildCharacterPool(target: Chengyu): string[] {
  const targetCharacters = splitCharacters(target);
  const distractorCandidates = Array.from(
    new Set(
      CHENGYU_DATASET.flatMap((chengyu) => splitCharacters(chengyu)).filter(
        (character) => !targetCharacters.includes(character),
      ),
    ),
  );

  const distractorCount = Math.min(
    distractorCandidates.length,
    randomInt(MIN_DISTRACTORS, MAX_DISTRACTORS),
  );

  const distractors = shuffle(distractorCandidates).slice(0, distractorCount);

  return shuffle([...targetCharacters, ...distractors]);
}

function createGuessResult(
  guess: string,
  feedback: GuessFeedback[],
  attemptNumber: number,
): GuessResult {
  return {
    guess,
    feedback,
    isCorrect: feedback.every((slot) => slot.status === "correct"),
    attemptNumber,
  };
}

export function createPuzzle(): Puzzle {
  const target = CHENGYU_DATASET[randomInt(0, CHENGYU_DATASET.length - 1)];

  return {
    target,
    pool: buildCharacterPool(target),
    attemptCount: 0,
    guesses: [],
    isSolved: false,
    isFailed: false,
  };
}

export function getFeedback(guess: string, target: Chengyu): GuessFeedback[] {
  const guessCharacters = splitCharacters(guess);
  const targetCharacters = splitCharacters(target);

  return guessCharacters.map((character, index) => {
    if (targetCharacters[index] === character) {
      return { character, index, status: "correct" };
    }

    if (targetCharacters.includes(character)) {
      return { character, index, status: "present" };
    }

    return { character, index, status: "absent" };
  });
}

export function submitGuess(puzzle: Puzzle, guess: string): SubmitGuessResult {
  if (puzzle.isSolved || puzzle.isFailed || puzzle.attemptCount >= MAX_GUESSES) {
    return {
      ok: false,
      error: "No more guesses are available.",
    };
  }

  const guessCharacters = splitCharacters(guess);

  if (guessCharacters.length !== TARGET_LENGTH) {
    return {
      ok: false,
      error: "Guess must contain exactly 4 characters.",
    };
  }

  if (!canBuildGuessFromPool(guessCharacters, puzzle.pool)) {
    return {
      ok: false,
      error: "Guess must use only characters from the pool.",
    };
  }

  const feedback = getFeedback(guess, puzzle.target);
  const attemptCount = puzzle.attemptCount + 1;
  const result = createGuessResult(guess, feedback, attemptCount);
  const isSolved = result.isCorrect;
  const isFailed = !isSolved && attemptCount >= MAX_GUESSES;

  return {
    ok: true,
    result,
    puzzle: {
      ...puzzle,
      attemptCount,
      guesses: [...puzzle.guesses, result],
      isSolved,
      isFailed,
    },
  };
}
