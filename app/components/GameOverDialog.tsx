import {ChengyuEntry, type Puzzle} from "../game";

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
    ? "text-[var(--color-state-success)] bg-[var(--color-state-success)]"
    : "text-[var(--color-text)] bg-[var(--color-state-failure)]";

  return (
    <div
      className={[
        "ui-dialog-header",
        resultHeaderClasses,
      ].join(" ")}
    >
      <h2 id="game-over-title" className="text-[1.75rem] leading-tight font-semibold tracking-[0.02em] sm:text-[1.875rem]">
        {resultTitle}
      </h2>
    </div>
  );
}

function DialogBody({learning}: {learning: ChengyuEntry}) {
  return (
    <div className="ui-dialog-body">
      <AnswerPreview
        hanzi={learning.hanzi}
        pinyin={learning.pinyin}
      />
      <LearningSummary
        meaning={learning.meaning}
        examples={learning.examples}
      />
    </div>
  )
}

function DialogActions({onClose}: {onClose: () => void}) {
  return (
    <div className="ui-dialog-actions">
      <button
        type="button"
        onClick={onClose}
        className="ui-button ui-text-button"
      >
        关闭
      </button>
      <button
        type="button"
        onClick={onClose}
        className="ui-button ui-text-button"
      >
        分享
      </button>
    </div>
  )
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
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          释义
        </p>
        <p className="text-sm leading-5 text-[var(--color-text)]">
          {meaning}
        </p>
      </section>

      <section className="mx-auto max-w-sm space-y-2">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          例句
        </p>
        <div className="space-y-2">
          {examples.map((example) => (
            <p key={example} className="text-sm leading-5 text-[var(--color-text)]">
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
        "ui-dialog-overlay",
        isVisible ? "ui-dialog-overlay-open" : "ui-dialog-overlay-closed",
      ].join(" ")}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-over-title"
        className={[
          "ui-dialog-panel",
          isVisible
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-2 opacity-0 sm:translate-y-3 sm:scale-[0.98]",
        ].join(" ")}
      >
        <div className="mx-auto flex h-full max-w-md flex-col justify-between sm:max-w-none">
          <DialogHeader isSolved={puzzle.isSolved}/>
          <DialogBody learning={puzzle.learning} />
          <DialogActions onClose={onClose}/>
        </div>
      </div>
    </div>
  );
}
