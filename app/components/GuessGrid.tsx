import {GUESS_LENGTH, type GuessFeedbackStatus, GuessResult, MAX_GUESSES} from "../game";

type GuessGridProps = {
  history: GuessResult[];
  currentGuess: string[];
  isGameOver: boolean;
  onRemoveCharacter: (index: number) => void;
};

function buildGuessSlots(currentGuess: string[]) {
  return Array.from({length: GUESS_LENGTH}, (_, index) => currentGuess[index] ?? null);
}

const feedbackStatusClasses: Record<GuessFeedbackStatus, string> = {
  correct: "ui-feedback-correct",
  present: "ui-feedback-present",
  absent: "ui-feedback-absent text-[var(--color-text-muted)]",
};

type FeedbackTileProps = {
  character: string;
  status: GuessFeedbackStatus;
};

function PastGuessTile({character, status}: FeedbackTileProps) {
  return (
    <div
      className={[
        "ui-tile ui-tile-guess",
        feedbackStatusClasses[status],
      ].join(" ")}
    >
      {character}
    </div>
  );
}

type EditableTileProps = {
  index: number;
  character: string | null;
  isGameOver: boolean;
  onRemoveCharacter: (index: number) => void;
};

function CurrentGuessTile({index, character, isGameOver, onRemoveCharacter}: EditableTileProps) {
  const tileStateClass = character ? "ui-tile-guess-filled" : "ui-tile-guess-empty";
  const animationClass = character ? "ui-animate-guess-slot" : "";

  return (
    <button
      type="button"
      onClick={() => onRemoveCharacter(index)}
      disabled={!character || isGameOver}
      className={[
        "ui-tile ui-tile-guess",
        tileStateClass,
        animationClass
      ].join(" ")}
    >
      {character ?? ""}
    </button>
  );
}

function EmptyGuessTile() {
  return (
    <div
      className="ui-tile ui-tile-guess ui-tile-placeholder"
    />
  );
}

export function GuessGrid({history, currentGuess, isGameOver, onRemoveCharacter}: GuessGridProps) {
  const guessSlots = buildGuessSlots(currentGuess);
  const activeRowIndex = isGameOver ? -1 : history.length;

  return (
    <section>
      <ol className="grid justify-center gap-1.5">
        {Array.from({length: MAX_GUESSES}, (_, rowIndex) => {
          const guess = history[rowIndex];
          const isActiveRow = rowIndex === activeRowIndex;

          return (
            <li key={`attempt-row-${rowIndex + 1}`}>
              <div className="flex justify-center gap-1.5">
                {guess
                  ? guess.feedback.map((slot) => (
                    <PastGuessTile
                      key={`past-slot-${rowIndex}-${slot.index}`}
                      character={slot.character}
                      status={slot.status}
                    />
                  ))
                  : isActiveRow
                    ? guessSlots.map((character, index) => (
                      <CurrentGuessTile
                        key={`current-slot-${rowIndex}-${index}-${character ?? "empty"}`}
                        index={index}
                        character={character}
                        isGameOver={isGameOver}
                        onRemoveCharacter={onRemoveCharacter}
                      />
                    ))
                    : Array.from({length: GUESS_LENGTH}, (_, index) => (
                      <EmptyGuessTile
                        key={`empty-slot-${rowIndex}-${index}`}
                      />
                    ))}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
