import {useEffect, useState} from "react";
import {createPuzzle, type GuessFeedbackStatus, MAX_GUESSES, type Puzzle, submitGuess} from "../game";

const GUESS_LENGTH = 4;

const feedbackStatusClasses: Record<GuessFeedbackStatus, string> = {
  correct: "border-transparent bg-green-500 text-white",
  present: "border-transparent bg-yellow-500 text-white",
  absent: "border-transparent bg-zinc-700 text-zinc-100",
};

const poolColorClasses = {
  default: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
  absent: "border-transparent bg-zinc-700 text-zinc-700",
  selected:
    "border-zinc-500 bg-transparent text-zinc-100 hover:bg-transparent",
} as const;

const guessTileBaseClasses = "h-[3rem] w-[3rem] flex items-center justify-center rounded-xl border text-2xl font-semibold";
const guessTileFilledClasses = "border-zinc-700 bg-zinc-900 text-zinc-100";
const guessTileEmptyClasses = "border-zinc-700 bg-zinc-900 text-zinc-600";
const guessTilePlaceholderClasses = "border-zinc-800 bg-zinc-950/70 text-zinc-700";
const poolTileBaseClasses = "h-[2.5rem] w-[2.5rem] flex items-center justify-center rounded-xl border text-lg font-semibold transition-colors";
const submitButtonBaseClasses = "h-[2.5rem] w-[2.5rem] flex items-center justify-center rounded-xl border text-lg transition-colors";

function buildGuessSlots(currentGuess: string[]) {
  return Array.from({length: GUESS_LENGTH}, (_, index) => currentGuess[index] ?? null);
}

function getPoolFeedbackMap(puzzle: Puzzle) {
  const feedbackByCharacter = new Map<string, GuessFeedbackStatus>();

  for (const guess of puzzle.guesses) {
    for (const slot of guess.feedback) {
      const current = feedbackByCharacter.get(slot.character);

      if (slot.status === "correct") {
        feedbackByCharacter.set(slot.character, "correct");
        continue;
      }

      if (slot.status === "present" && current !== "correct") {
        feedbackByCharacter.set(slot.character, "present");
        continue;
      }

      if (!current) {
        feedbackByCharacter.set(slot.character, "absent");
      }
    }
  }

  return feedbackByCharacter;
}

export default function HomePage() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPuzzle(createPuzzle());
  }, []);

  function handleSelectCharacter(character: string) {
    if (!puzzle || puzzle.isSolved || currentGuess.length >= GUESS_LENGTH) {
      return;
    }

    if (currentGuess.includes(character)) {
      return;
    }

    setCurrentGuess((guess) => [...guess, character]);
    setErrorMessage(null);
  }

  function handleRemoveCharacter(index: number) {
    if (!puzzle || puzzle.isSolved) {
      return;
    }

    setCurrentGuess((guess) => guess.filter((_, guessIndex) => guessIndex !== index));
    setErrorMessage(null);
  }

  function handleSubmitGuess() {
    if (!puzzle || currentGuess.length !== GUESS_LENGTH || puzzle.isSolved) {
      return;
    }

    const submission = submitGuess(puzzle, currentGuess.join(""));

    if (!submission.ok) {
      setErrorMessage(submission.error);
      return;
    }

    setPuzzle(submission.puzzle);
    setCurrentGuess([]);
    setErrorMessage(null);
  }

  if (!puzzle) {
    return (
      <main className="flex min-h-screen items-center px-4 py-10 sm:px-6">
        <section className="mx-auto w-full max-w-4xl p-6 sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-300">
            Daily Puzzle
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Chengyu Puzzle Game
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">
            Loading puzzle...
          </p>
        </section>
      </main>
    );
  }

  const guessSlots = buildGuessSlots(currentGuess);
  const isGameOver = puzzle.isSolved || puzzle.isFailed;
  const isSubmitDisabled = currentGuess.length !== GUESS_LENGTH || isGameOver;
  const history = puzzle.guesses;
  const poolFeedbackMap = getPoolFeedbackMap(puzzle);
  const activeRowIndex = isGameOver ? -1 : history.length;

  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-2xl">
        <h1 className="title-display text-3xl text-center uppercase tracking-[0.04em] text-zinc-50 sm:text-5xl">
          Chengle
        </h1>

        <div className="mt-6 space-y-6">
          <section>
            <ol className="space-y-1">
              {Array.from({length: MAX_GUESSES}, (_, rowIndex) => {
                const guess = history[rowIndex];
                const isActiveRow = rowIndex === activeRowIndex;

                return (
                  <li key={`attempt-row-${rowIndex + 1}`}>
                    <div className="flex gap-1.25 justify-center">
                      {guess ? (
                        guess.feedback.map((slot) => (
                          <div
                            key={`${guess.attemptNumber}-${slot.index}`}
                            className={[
                              guessTileBaseClasses,
                              feedbackStatusClasses[slot.status],
                            ].join(" ")}
                          >
                            {slot.character}
                          </div>
                        ))
                      ) : isActiveRow ? (
                        guessSlots.map((character, index) => (
                          <button
                            key={`guess-slot-${rowIndex}-${index}`}
                            type="button"
                            onClick={() => handleRemoveCharacter(index)}
                            disabled={!character || isGameOver}
                            className={[
                              guessTileBaseClasses,
                              "transition-colors",
                              character ? guessTileFilledClasses : guessTileEmptyClasses,
                              !character || isGameOver ? "disabled:cursor-default" : "",
                            ].join(" ")}
                          >
                            {character ?? ""}
                          </button>
                        ))
                      ) : (
                        Array.from({length: GUESS_LENGTH}, (_, index) => (
                          <div
                            key={`placeholder-slot-${rowIndex}-${index}`}
                            className={[guessTileBaseClasses, guessTilePlaceholderClasses].join(" ")}
                          />
                        ))
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section>
            <div className="flex flex-wrap justify-center gap-2">
              {puzzle.pool.map((character) => {
                const isSelected = currentGuess.includes(character);
                const feedbackStatus = poolFeedbackMap.get(character);
                const isAbsent = feedbackStatus === "absent";
                const isDisabled =
                  isSelected ||
                  isAbsent ||
                  currentGuess.length >= GUESS_LENGTH ||
                  isGameOver;

                return (
                  <button
                    key={character}
                    type="button"
                    onClick={() => handleSelectCharacter(character)}
                    disabled={isDisabled}
                    className={[
                      poolTileBaseClasses,
                      isSelected
                        ? poolColorClasses.selected
                        : feedbackStatus
                          ? feedbackStatus === "absent"
                            ? poolColorClasses.absent
                            : feedbackStatusClasses[feedbackStatus]
                          : poolColorClasses.default,
                      isDisabled ? "disabled:cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {isAbsent ? "" : character}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleSubmitGuess}
                disabled={isSubmitDisabled}
                aria-label="Submit guess"
                className={[
                  submitButtonBaseClasses,
                  isSubmitDisabled
                    ? "border-transparent bg-zinc-800 text-zinc-500"
                    : "border-transparent bg-zinc-100 text-zinc-950 hover:bg-white",
                ].join(" ")}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m13 6 6 6-6 6"/>
                </svg>
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
