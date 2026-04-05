import {useEffect, useState} from "react";
import {ChengyuEntry, type GuessFeedbackStatus, type Puzzle} from "../game";

type GameOverDialogProps = {
  puzzle: Puzzle;
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
};

type DialogActionsProps = {
  onClose: () => void;
  onShare: () => void;
  shareLabel: string;
};

const SHARE_LABEL_DEFAULT = "分享";
const SHARE_LABEL_SUCCESS = "已复制";
const SHARE_RESET_DELAY_MS = 1800;

function buildPinyinSyllables(pinyin: string) {
  return pinyin.split(/\s+/).filter(Boolean);
}

function getShareStatusEmoji(status: GuessFeedbackStatus) {
  switch (status) {
    case "correct":
      return "🟩";
    case "present":
      return "🟨";
    case "absent":
      return "⬜";
  }
}

function buildShareText(puzzle: Puzzle) {
  const resultSummary = puzzle.isSolved ? `${puzzle.attemptCount}/4` : "X/4";
  const guessRows = puzzle.guesses.map((guess) =>
    guess.feedback.map((slot) => getShareStatusEmoji(slot.status)).join(""),
  );

  return [
    `成语乐 ${resultSummary}`,
    "",
    ...guessRows,
  ].join("\n");
}

async function copyToClipboard(text: string) {
  if (!navigator.clipboard?.writeText) {
    throw new Error("Clipboard API is unavailable.");
  }

  await navigator.clipboard.writeText(text);
}

function DialogHeader({isSolved}: {isSolved: boolean}) {
  const resultTitle = isSolved ? "答对了！" : "差一点！";
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
  );
}

function DialogActions({onClose, onShare, shareLabel}: DialogActionsProps) {
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
        onClick={onShare}
        className="ui-button ui-text-button"
      >
        {shareLabel}
      </button>
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
  const [shareLabel, setShareLabel] = useState(SHARE_LABEL_DEFAULT);

  useEffect(() => {
    if (shareLabel === SHARE_LABEL_DEFAULT) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShareLabel(SHARE_LABEL_DEFAULT);
    }, SHARE_RESET_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [shareLabel]);

  async function handleShare() {
    try {
      await copyToClipboard(buildShareText(puzzle));
      setShareLabel(SHARE_LABEL_SUCCESS);
    } catch (error) {
      console.error(error);
    }
  }

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
          <DialogActions
            onClose={onClose}
            onShare={handleShare}
            shareLabel={shareLabel}
          />
        </div>
      </div>
    </div>
  );
}
