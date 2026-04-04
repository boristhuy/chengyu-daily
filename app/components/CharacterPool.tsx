import {type GuessFeedbackStatus, type Puzzle} from "../game";

const GUESS_LENGTH = 4;

const feedbackStatusClasses: Record<GuessFeedbackStatus, string> = {
  correct: "border-transparent bg-green-500 text-white",
  present: "border-transparent bg-yellow-500 text-white",
  absent: "border-transparent bg-zinc-700 text-zinc-700",
};

const poolColorClasses = {
  default: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
  absent: "border-transparent bg-zinc-700 text-zinc-700",
} as const;

const poolTileBaseClasses = "flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-xl border text-lg font-semibold transition-colors transition-transform duration-100 active:scale-95";
const submitButtonBaseClasses = "flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-xl border text-lg transition-colors";

type CharacterPoolProps = {
  puzzle: Puzzle;
  currentGuess: string[];
  isGameOver: boolean;
  onSelectCharacter: (character: string) => void;
  onSubmitGuess: () => void;
  onOpenResults: () => void;
};

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

export function CharacterPool({
  puzzle,
  currentGuess,
  isGameOver,
  onSelectCharacter,
  onSubmitGuess,
  onOpenResults,
}: CharacterPoolProps) {
  const isSubmitDisabled = currentGuess.length !== GUESS_LENGTH || isGameOver;
  const poolFeedbackMap = getPoolFeedbackMap(puzzle);

  if (isGameOver) {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onOpenResults}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-zinc-800 px-5 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
        >
          Results
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {puzzle.pool.map((character) => {
        const feedbackStatus = poolFeedbackMap.get(character);
        const isAbsent = feedbackStatus === "absent";
        const isDisabled = isAbsent || currentGuess.length >= GUESS_LENGTH;

        return (
          <button
            key={character}
            type="button"
            onClick={() => onSelectCharacter(character)}
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
        onClick={onSubmitGuess}
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
          <path d="M5 12h14"/>
          <path d="m13 6 6 6-6 6"/>
        </svg>
      </button>
    </div>
  );
}
