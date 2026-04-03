import { useEffect, useState } from "react";
import { createPuzzle, type GuessFeedbackStatus, MAX_GUESSES, type Puzzle, submitGuess } from "../game";

const GUESS_LENGTH = 4;

const feedbackStatusClasses: Record<GuessFeedbackStatus, string> = {
  correct: "border-transparent bg-green-500 text-white",
  present: "border-transparent bg-yellow-500 text-white",
  absent: "border-transparent bg-zinc-700 text-zinc-100",
};

const poolColorClasses = {
  default: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
  absent: "border-transparent bg-zinc-700 text-zinc-700",
} as const;

const guessTileBaseClasses = "flex h-[3rem] w-[3rem] items-center justify-center rounded-xl border text-2xl font-semibold";
const guessTileFilledClasses = "border-zinc-700 bg-zinc-900 text-zinc-100";
const guessTileEmptyClasses = "border-zinc-700 bg-zinc-900 text-zinc-600";
const guessTilePlaceholderClasses = "border-zinc-800 bg-zinc-950/70 text-zinc-700";
const poolTileBaseClasses = "flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-xl border text-lg font-semibold transition-colors transition-transform duration-100 active:scale-95";
const submitButtonBaseClasses = "flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-xl border text-lg transition-colors";
const dialogPanelClasses = "w-full min-h-screen bg-zinc-950 sm:min-h-0 sm:max-w-sm sm:overflow-hidden sm:rounded-3xl sm:border sm:border-zinc-800 sm:bg-zinc-900";
const DIALOG_TRANSITION_MS = 180;

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

function buildPinyinSyllables(pinyin: string) {
  return pinyin.split(/\s+/).filter(Boolean);
}

export default function HomePage() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState(false);
  const [isGameOverDialogVisible, setIsGameOverDialogVisible] = useState(false);

  useEffect(() => {
    setPuzzle(createPuzzle());
  }, []);

  useEffect(() => {
    if (puzzle && (puzzle.isSolved || puzzle.isFailed)) {
      setIsGameOverDialogOpen(true);
    }
  }, [puzzle]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (isGameOverDialogOpen) {
      timeoutId = setTimeout(() => {
        setIsGameOverDialogVisible(true);
      }, 10);
    } else {
      setIsGameOverDialogVisible(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isGameOverDialogOpen]);

  function handleSelectCharacter(character: string) {
    if (!puzzle || puzzle.isSolved || puzzle.isFailed || currentGuess.length >= GUESS_LENGTH) {
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
  const pinyinSyllables = buildPinyinSyllables(puzzle.learning.pinyin);
  const resultTitle = puzzle.isSolved ? "You won!" : "Game over!";
  const resultHeaderClasses = puzzle.isSolved
    ? "border-transparent bg-green-500 text-white"
    : "border-transparent bg-red-500 text-white";

  function handleCloseGameOverDialog() {
    setIsGameOverDialogVisible(false);
    setTimeout(() => {
      setIsGameOverDialogOpen(false);
    }, DIALOG_TRANSITION_MS);
  }

  function handleOpenGameOverDialog() {
    if (!isGameOver) {
      return;
    }

    setIsGameOverDialogOpen(true);
  }

  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-2xl">
        <h1 className="title-display text-center text-3xl uppercase tracking-[0.04em] text-zinc-50 sm:text-5xl">
          成语乐
        </h1>

        <div className="mt-6 space-y-6">
          <section>
            <ol className="grid justify-center gap-1.5">
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
                            key={`guess-slot-${rowIndex}-${index}-${character ?? "empty"}`}
                            type="button"
                            onClick={() => handleRemoveCharacter(index)}
                            disabled={!character || isGameOver}
                            className={[
                              guessTileBaseClasses,
                              "transition-colors",
                              character ? guessTileFilledClasses : guessTileEmptyClasses,
                              character ? "animate-guess-slot-pop" : "",
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
            {isGameOver ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleOpenGameOverDialog}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-zinc-800 px-5 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
                >
                  Results
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-1.5">
                {puzzle.pool.map((character) => {
                  const feedbackStatus = poolFeedbackMap.get(character);
                  const isAbsent = feedbackStatus === "absent";
                  const isDisabled = isAbsent || currentGuess.length >= GUESS_LENGTH;

                  return (
                    <button
                      key={character}
                      type="button"
                      onClick={() => handleSelectCharacter(character)}
                      disabled={isDisabled}
                      className={[
                        poolTileBaseClasses,
                        feedbackStatus
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
            )}
          </section>

          {errorMessage ? (
            <p className="text-center text-sm text-rose-300">{errorMessage}</p>
          ) : null}
        </div>
      </section>

      {isGameOverDialogOpen ? (
        <div
          className={[
            "fixed inset-0 z-50 transition-all duration-200 sm:flex sm:items-center sm:justify-center sm:p-6",
            isGameOverDialogVisible ? "bg-zinc-950/80 backdrop-blur-sm" : "bg-zinc-950/0 backdrop-blur-none",
          ].join(" ")}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-over-title"
            className={[
              dialogPanelClasses,
              "transition-all duration-200",
              isGameOverDialogVisible
                ? "translate-y-0 opacity-100 sm:scale-100"
                : "translate-y-2 opacity-0 sm:translate-y-3 sm:scale-[0.98]",
            ].join(" ")}
          >
            <div className="mx-auto flex h-full max-w-md flex-col justify-between sm:max-w-none">
              <div className="space-y-6 px-5 py-8 sm:px-6 sm:py-6">
                <div
                  className={[
                    "-mx-5 -mt-8 border-b px-5 py-4 text-center sm:-mx-6 sm:-mt-6 sm:px-6",
                    resultHeaderClasses,
                  ].join(" ")}
                >
                  <h2 id="game-over-title" className="text-2xl font-semibold sm:text-[1.75rem]">
                    {resultTitle}
                  </h2>
                </div>

                <div className="space-y-3">
                  <p className="text-center text-sm text-zinc-400 sm:text-base">
                    The answer was
                  </p>

                  <div className="flex justify-center gap-3 sm:gap-4">
                  {Array.from(puzzle.learning.hanzi).map((character, index) => (
                    <div key={`${character}-${index}`} className="min-w-0 text-center">
                      <p className="text-4xl font-semibold text-zinc-50 sm:text-[2.75rem]">
                        {character}
                      </p>
                      <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                        {pinyinSyllables[index] ?? ""}
                      </p>
                    </div>
                  ))}
                  </div>
                </div>

                <div className="space-y-4 border-t border-zinc-800 pt-4">
                  <section className="mx-auto max-w-sm space-y-1.5">
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                      Meaning
                    </p>
                    <p className="text-sm leading-5 text-zinc-100">
                      {puzzle.learning.meaning}
                    </p>
                  </section>

                  <section className="mx-auto max-w-sm space-y-2">
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                      {puzzle.learning.examples.length > 1 ? "Examples" : "Example"}
                    </p>
                    <div className="space-y-2">
                      {puzzle.learning.examples.map((example) => (
                        <p key={example} className="text-sm leading-5 text-zinc-100">
                          {example}
                        </p>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              <div className="px-5 pb-8 sm:px-6 sm:pb-6">
                <button
                  type="button"
                  onClick={handleCloseGameOverDialog}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-zinc-100 px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-300 active:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 sm:w-auto"
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
