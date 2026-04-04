import {type Puzzle} from "../game";

const dialogPanelClasses = "w-full min-h-screen bg-zinc-950 sm:min-h-0 sm:max-w-sm sm:overflow-hidden sm:rounded-3xl sm:border sm:border-zinc-800 sm:bg-zinc-900";

type GameOverDialogProps = {
  puzzle: Puzzle;
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
};

function buildPinyinSyllables(pinyin: string) {
  return pinyin.split(/\s+/).filter(Boolean);
}

export function GameOverDialog({puzzle, isOpen, isVisible, onClose}: GameOverDialogProps) {
  if (!isOpen) {
    return null;
  }

  const pinyinSyllables = buildPinyinSyllables(puzzle.learning.pinyin);
  const resultTitle = puzzle.isSolved ? "You won!" : "Game over!";
  const resultHeaderClasses = puzzle.isSolved
    ? "border-transparent bg-green-500 text-white"
    : "border-transparent bg-red-500 text-white";

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition-all duration-200 sm:flex sm:items-center sm:justify-center sm:p-6",
        isVisible ? "bg-zinc-950/80 backdrop-blur-sm" : "bg-zinc-950/0 backdrop-blur-none",
      ].join(" ")}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-over-title"
        className={[
          dialogPanelClasses,
          "transition-all duration-200",
          isVisible
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
              onClick={onClose}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-zinc-100 px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-300 active:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
