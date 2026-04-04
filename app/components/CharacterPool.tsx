import {type GuessFeedbackStatus, type Puzzle} from "../game";

const GUESS_LENGTH = 4;

const feedbackStatusClasses: Record<GuessFeedbackStatus, string> = {
  correct: "ui-feedback-correct",
  present: "ui-feedback-present",
  absent: "ui-feedback-absent",
};

const poolColorClasses = {
  default: "ui-tile-pool-default",
  absent: "ui-feedback-absent",
} as const;

type CharacterPoolProps = {
  puzzle: Puzzle;
  currentGuess: string[];
  isGameOver: boolean;
  onSelectCharacter: (character: string) => void;
  onSubmitGuess: () => void;
  onOpenResults: () => void;
};

type PoolTileProps = {
  character: string;
  feedbackStatus: GuessFeedbackStatus | undefined;
  isGuessFull: boolean;
  onSelectCharacter: (character: string) => void;
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

function PoolTile({character, feedbackStatus, isGuessFull, onSelectCharacter}: PoolTileProps) {
  const isAbsent = feedbackStatus === "absent";
  const isDisabled = isAbsent || isGuessFull;
  const colorClass = feedbackStatus
    ? feedbackStatus === "absent"
      ? poolColorClasses.absent
      : feedbackStatusClasses[feedbackStatus]
    : poolColorClasses.default;

  return (
    <button
      type="button"
      onClick={() => onSelectCharacter(character)}
      disabled={isDisabled}
      className={[
        "ui-tile ui-tile-pool",
        colorClass,
        isDisabled ? "disabled:cursor-not-allowed" : "",
      ].join(" ")}
    >
      {isAbsent ? "" : character}
    </button>
  );
}

function ResultsButton({onOpenResults}: {onOpenResults: () => void}) {
  return (
    <button
      type="button"
      onClick={onOpenResults}
      className="ui-button ui-button-secondary"
    >
      Results
    </button>
  );
}

function SubmitGuessButton({isDisabled, onSubmitGuess}: {isDisabled: boolean; onSubmitGuess: () => void}) {
  const buttonStateClass = isDisabled
    ? "border-transparent bg-zinc-800 text-zinc-500"
    : "border-transparent bg-zinc-100 text-zinc-950 hover:bg-white";

  return (
    <button
      type="button"
      onClick={onSubmitGuess}
      disabled={isDisabled}
      aria-label="Submit guess"
      className={["ui-icon-button", buttonStateClass].join(" ")}
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
  );
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
  const isGuessFull = currentGuess.length >= GUESS_LENGTH;
  const poolFeedbackMap = getPoolFeedbackMap(puzzle);

  if (isGameOver) {
    return (
      <div className="flex justify-center">
        <ResultsButton onOpenResults={onOpenResults}/>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {puzzle.pool.map((character) => (
        <PoolTile
          key={character}
          character={character}
          feedbackStatus={poolFeedbackMap.get(character)}
          isGuessFull={isGuessFull}
          onSelectCharacter={onSelectCharacter}
        />
      ))}

      <SubmitGuessButton
        isDisabled={isSubmitDisabled}
        onSubmitGuess={onSubmitGuess}
      />
    </div>
  );
}
