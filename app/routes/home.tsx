import { useEffect, useState } from "react";
import { createPuzzle, type GuessFeedbackStatus, MAX_GUESSES, type Puzzle, submitGuess } from "../game";

const GUESS_LENGTH = 4;

const feedbackStatusClasses: Record<GuessFeedbackStatus, string> = {
  correct: "border-transparent bg-emerald-400 text-white",
  present: "border-transparent bg-amber-400 text-white",
  absent: "border-transparent bg-zinc-700 text-zinc-100",
};

const poolColorClasses = {
  default: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
  absent: "border-transparent bg-zinc-700 text-zinc-700",
  selected: "border-zinc-500 bg-transparent text-zinc-100 hover:bg-transparent",
} as const;

const guessTileBaseClasses = "flex h-[3rem] w-[3rem] items-center justify-center rounded-xl border text-2xl font-semibold";
const guessTileFilledClasses = "border-zinc-700 bg-zinc-900 text-zinc-100";
const guessTileEmptyClasses = "border-zinc-700 bg-zinc-900 text-zinc-600";
const guessTilePlaceholderClasses = "border-zinc-800 bg-zinc-950/70 text-zinc-700";
const poolTileBaseClasses = "flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-xl border text-lg font-semibold transition-colors";
const submitButtonBaseClasses = "flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-xl border text-lg transition-colors";
const dialogPanelClasses = "w-full min-h-screen bg-zinc-950 px-4 py-6 sm:min-h-0 sm:max-w-lg sm:rounded-3xl sm:border sm:border-zinc-800 sm:bg-zinc-900 sm:p-7";

function buildGuessSlots(currentGuess: string[]) {
  return Array.from({ length: GUESS_LENGTH }, (_, index) => currentGuess[index] ?? null);
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
  const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState(false);

  useEffect(() => {
    setPuzzle(createPuzzle());
  }, []);

  useEffect(() => {
    if (puzzle && (puzzle.isSolved || puzzle.isFailed)) {
      setIsGameOverDialogOpen(true);
    }
  }, [puzzle]);

  function handleSelectCharacter(character: string) {
    if (!puzzle || puzzle.isSolved || puzzle.isFailed || currentGuess.length >= GUESS_LENGTH) {
      return;
    }

    if (currentGuess.includes(character)) {
      return;
    }

    setCurrentGuess((guess) => [...guess, character]);
    setErrorMessage(null);
  }

  function handleRemoveCharacter(index: number) {
    if (!puzzle || puzzle.isSolved || puzzle.isFailed) {
      return;
    }

    setCurrentGuess((guess) => guess.filter((_, guessIndex) => guessIndex !== index));
    setErrorMessage(null);
  }

  function handleSubmitGuess() {
    if (!puzzle || currentGuess.length !== GUESS_LENGTH || puzzle.isSolved || puzzle.isFailed) {
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
  const resultRecap = puzzle.isSolved
    ? `Victory! You solved it in ${puzzle.attemptCount} ${puzzle.attemptCount === 1 ? "attempt" : "attempts"}.`
    : `Game over. You used all ${MAX_GUESSES} attempts.`;

  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-2xl">
        <h1 className="title-display text-center text-3xl uppercase tracking-[0.04em] text-zinc-50 sm:text-5xl">
          成语乐
        </h1>

        <div className="mt-6 space-y-6">
          <section>
            <ol className="space-y-1.5">
              {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
                const guess = history[rowIndex];
                const isActiveRow = rowIndex === activeRowIndex;

                return (
                  <li key={`attempt-row-${rowIndex + 1}`}>
                    <div className="flex justify-center gap-1.5">
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
                        Array.from({ length: GUESS_LENGTH }, (_, index) => (
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
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            </div>
          </section>

          {errorMessage ? (
            <p className="text-center text-sm text-rose-300">{errorMessage}</p>
          ) : null}
        </div>
      </section>

      {isGameOverDialogOpen ? (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm sm:flex sm:items-center sm:justify-center sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-over-title"
            className={dialogPanelClasses}
          >
            <div className="mx-auto flex h-full max-w-lg flex-col justify-between gap-6 sm:block">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-sky-300">
                  {puzzle.isSolved ? "Victory" : "Finished"}
                </p>
                <h2 id="game-over-title" className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">
                  {resultRecap}
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Correct chengyu: <span className="font-medium text-zinc-100">{puzzle.target}</span>
                </p>
              </div>

              <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
                  Learning
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-3xl font-semibold tracking-[0.08em] text-zinc-50">
                      {puzzle.learning.hanzi}
                    </p>
                    <p className="mt-2 text-base text-sky-200">
                      {puzzle.learning.pinyin}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                      Meaning
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-200">
                      {puzzle.learning.meaning}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                      Example
                    </p>
                    <div className="mt-2 space-y-2">
                      {puzzle.learning.examples.map((example) => (
                        <p key={example} className="text-sm leading-6 text-zinc-300">
                          {example}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsGameOverDialogOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-zinc-100 px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
