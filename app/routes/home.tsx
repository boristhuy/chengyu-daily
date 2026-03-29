import { CHENGYU_DATASET, createPuzzle, submitGuess } from "../game";

export default function HomePage() {
  const puzzle = createPuzzle();
  const previewSubmission = submitGuess(puzzle, puzzle.target);

  if (!previewSubmission.ok) {
    throw new Error(previewSubmission.error);
  }

  return (
    <main className="flex min-h-screen items-center px-4 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-xl rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-700">
          Daily Puzzle
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
          Chengyu Puzzle Game
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
          Core game logic is implemented. The page below is only a lightweight
          smoke preview until the real game UI is built.
        </p>
        <dl className="mt-8 space-y-3 text-sm text-stone-700">
          <div className="flex items-start justify-between gap-4">
            <dt className="font-medium text-stone-500">Dataset size</dt>
            <dd>{CHENGYU_DATASET.length} puzzles</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-medium text-stone-500">Character pool</dt>
            <dd className="text-right text-lg tracking-[0.2em] text-stone-900">
              {puzzle.pool.join(" ")}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-medium text-stone-500">Attempt count</dt>
            <dd>{previewSubmission.puzzle.attemptCount}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-medium text-stone-500">Stored guesses</dt>
            <dd>{previewSubmission.puzzle.guesses.length}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-medium text-stone-500">Solved state</dt>
            <dd>{previewSubmission.puzzle.isSolved ? "Solved" : "In progress"}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-medium text-stone-500">Feedback preview</dt>
            <dd className="text-right uppercase text-stone-900">
              {previewSubmission.result.feedback.map((slot) => slot.color).join(", ")}
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm leading-6 text-stone-500">
          `createPuzzle()`, `submitGuess(...)`, and `getFeedback(...)` are ready
          for the next UI step.
        </p>
      </section>
    </main>
  );
}

