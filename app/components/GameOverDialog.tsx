import {type Puzzle} from "../game";

type GameOverDialogProps = {
  puzzle: Puzzle;
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
};

function buildPinyinSyllables(pinyin: string) {
  return pinyin.split(/\s+/).filter(Boolean);
}

function DialogHeader({isSolved}: {isSolved: boolean}) {
  const resultTitle = isSolved ? "挑战成功" : "挑战结束";
  const resultHeaderClasses = isSolved
    ? "ui-feedback-correct"
    : "ui-feedback-failure";

  return (
    <div
      className={[
        "-mx-5 -mt-8 border-b border-black/10 px-5 py-3 text-center sm:-mx-6 sm:-mt-6 sm:px-6",
        resultHeaderClasses,
      ].join(" ")}
    >
      <h2 id="game-over-title" className="text-[1.75rem] leading-tight font-semibold tracking-[0.02em] sm:text-[1.875rem]">
        {resultTitle}
      </h2>
    </div>
  );
}

function AnswerPreview({hanzi, pinyin}: {hanzi: string; pinyin: string}) {
  const pinyinSyllables = buildPinyinSyllables(pinyin);

  return (
    <div className="space-y-2.5">
      <p className="text-center text-sm text-[var(--color-text-muted)]">
        正确答案
      </p>

      <div className="flex justify-center gap-3 sm:gap-4">
        {Array.from(hanzi).map((character, index) => (
          <div key={`${character}-${index}`} className="min-w-0 text-center">
            <p className="text-2xl font-semibold leading-none text-[var(--color-text)]">
              {character}
            </p>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              {pinyinSyllables[index] ?? ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LearningSummary({meaning, examples}: {meaning: string; examples: string[]}) {
  return (
    <div className="ui-section-divider space-y-4 border-t pt-4">
      <section className="mx-auto max-w-sm space-y-1">
        <p className="ui-dialog-label">
          释义
        </p>
        <p className="ui-dialog-copy">
          {meaning}
        </p>
      </section>

      <section className="mx-auto max-w-sm space-y-2">
        <p className="ui-dialog-label">
          例句
        </p>
        <div className="space-y-2">
          {examples.map((example) => (
            <p key={example} className="ui-dialog-copy">
              {example}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

export function GameOverDialog({puzzle, isOpen, isVisible, onClose}: GameOverDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition-all duration-200 sm:flex sm:items-center sm:justify-center sm:p-6",
        isVisible ? "ui-overlay-open" : "ui-overlay-closed",
      ].join(" ")}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-over-title"
        className={[
          "ui-dialog-panel",
          "transition-all duration-200",
          isVisible
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-2 opacity-0 sm:translate-y-3 sm:scale-[0.98]",
        ].join(" ")}
      >
        <div className="mx-auto flex h-full max-w-md flex-col justify-between sm:max-w-none">
          <div className="space-y-5 px-5 py-8 sm:px-6 sm:py-6">
            <DialogHeader isSolved={puzzle.isSolved}/>
            <AnswerPreview
              hanzi={puzzle.learning.hanzi}
              pinyin={puzzle.learning.pinyin}
            />
            <LearningSummary
              meaning={puzzle.learning.meaning}
              examples={puzzle.learning.examples}
            />
          </div>

          <div className="px-5 pb-4 sm:px-6 sm:pb-4">
            <button
              type="button"
              onClick={onClose}
              className="ui-button ui-button-primary w-full sm:w-auto"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
