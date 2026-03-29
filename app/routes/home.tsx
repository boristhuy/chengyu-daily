import {useEffect, useState} from "react";
import {createPuzzle, submitGuess, type FeedbackColor, type Puzzle} from "../game";

const GUESS_LENGTH = 4;

const feedbackColorClasses: Record<FeedbackColor, string> = {
  green: "border-transparent bg-green-500 text-white",
  orange: "border-transparent bg-yellow-500 text-white",
  red: "border-transparent bg-zinc-700 text-zinc-100",
};

const poolColorClasses = {
  default: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
  green: "border-transparent bg-green-500 text-white hover:bg-green-500",
  orange: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500",
  red: "border-transparent bg-zinc-700 text-zinc-700 hover:bg-zinc-700",
  selected:
    "border-zinc-500 bg-transparent text-zinc-100 hover:bg-transparent",
} as const;

function buildGuessSlots(currentGuess: string[]) {
  return Array.from({length: GUESS_LENGTH}, (_, index) => currentGuess[index] ?? null);
}

function getPoolFeedbackMap(puzzle: Puzzle) {
  const feedbackByCharacter = new Map<string, FeedbackColor>();

  for (const guess of puzzle.guesses) {
    for (const slot of guess.feedback) {
      const current = feedbackByCharacter.get(slot.character);

      if (slot.color === "green") {
        feedbackByCharacter.set(slot.character, "green");
        continue;
      }

      if (slot.color === "orange" && current !== "green") {
        feedbackByCharacter.set(slot.character, "orange");
        continue;
      }

      if (!current) {
        feedbackByCharacter.set(slot.character, "red");
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
  const isSubmitDisabled = currentGuess.length !== GUESS_LENGTH || puzzle.isSolved;
  const history = puzzle.guesses;
  const poolFeedbackMap = getPoolFeedbackMap(puzzle);

  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-2xl">
        <h1 className="title-display text-3xl text-center uppercase tracking-[0.04em] text-zinc-50 sm:text-5xl">
          Chengle
        </h1>

        <div className="mt-6 space-y-6">
          <section>
            <ol className="space-y-2">
              {history.map((guess) => (
                <li key={guess.attemptNumber}>
                  <div className="flex gap-2 sm:justify-center">
                    {guess.feedback.map((slot) => (
                      <div
                        key={`${guess.attemptNumber}-${slot.index}`}
                        className={[
                          "flex h-11 w-11 items-center justify-center rounded-xl border text-lg font-semibold sm:h-[3.25rem] sm:w-[3.25rem] sm:text-xl",
                          feedbackColorClasses[slot.color],
                        ].join(" ")}
                      >
                        {slot.character}
                      </div>
                    ))}
                  </div>
                </li>
              ))}

              {!puzzle.isSolved ? (
                <li>
                  <div className="flex gap-2 sm:justify-center">
                    {guessSlots.map((character, index) => (
                      <button
                        key={`guess-slot-${index}`}
                        type="button"
                        onClick={() => handleRemoveCharacter(index)}
                        disabled={!character || puzzle.isSolved}
                        className={[
                          "flex h-11 w-11 items-center justify-center rounded-xl border text-lg font-semibold transition-colors sm:h-[3.25rem] sm:w-[3.25rem] sm:text-xl",
                          character
                            ? "border border-zinc-700 bg-zinc-900 text-zinc-100"
                            : "border border-zinc-700 bg-zinc-900 text-zinc-600",
                          !character || puzzle.isSolved ? "disabled:cursor-default" : "",
                        ].join(" ")}
                      >
                        {character ?? ""}
                      </button>
                    ))}
                  </div>
                </li>
              ) : null}
            </ol>
          </section>

          <section>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {puzzle.pool.map((character) => {
                const isSelected = currentGuess.includes(character);
                const feedbackColor = poolFeedbackMap.get(character);
                const isAbsent = feedbackColor === "red";
                const isDisabled =
                  isSelected ||
                  isAbsent ||
                  currentGuess.length >= GUESS_LENGTH ||
                  puzzle.isSolved;

                return (
                  <button
                    key={character}
                    type="button"
                    onClick={() => handleSelectCharacter(character)}
                    disabled={isDisabled}
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-xl border text-lg font-semibold transition-colors sm:h-11 sm:w-11 sm:text-xl",
                      isSelected
                        ? poolColorClasses.selected
                        : feedbackColor
                          ? poolColorClasses[feedbackColor]
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
                  "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors sm:h-11 sm:w-11",
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
