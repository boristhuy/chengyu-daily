import {type GuessFeedbackStatus, GuessResult, MAX_GUESSES} from "../game";

const GUESS_LENGTH = 4;

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
  absent: "border-transparent bg-zinc-700 text-zinc-100",
};

type FeedbackTileProps = {
  index: number;
  character: string;
  attemptNumber: number;
  status: GuessFeedbackStatus;
};

function PastGuessTile({attemptNumber, index, character, status}: FeedbackTileProps) {
  return (
    <div
      key={`${attemptNumber}-${index}`}
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
  rowIndex: number;
  index: number;
  character: string | null;
  isGameOver: boolean;
  onRemoveCharacter: (index: number) => void;
};

function CurrentGuessTile({rowIndex, index, character, isGameOver, onRemoveCharacter}: EditableTileProps) {
  const tileStateClass = character ? "ui-tile-guess-filled" : "ui-tile-guess-empty";
  const animationClass = character ? "animate-guess-slot-pop" : "";

  return (
    <button
      key={`guess-slot-${rowIndex}-${index}-${character ?? "empty"}`}
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

type PlaceholderTileProps = {
  rowIndex: number;
  index: number;
};

function EmptyGuessTile({rowIndex, index}: PlaceholderTileProps) {
  return (
    <div
      key={`placeholder-slot-${rowIndex}-${index}`}
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
                      key={`${guess.attemptNumber}-${slot.index}`}
                      attemptNumber={guess.attemptNumber}
                      index={slot.index}
                      character={slot.character}
                      status={slot.status}
                    />
                  ))
                  : isActiveRow
                    ? guessSlots.map((character, index) => (
                      <CurrentGuessTile
                        key={`guess-slot-${rowIndex}-${index}-${character ?? "empty"}`}
                        rowIndex={rowIndex}
                        index={index}
                        character={character}
                        isGameOver={isGameOver}
                        onRemoveCharacter={onRemoveCharacter}
                      />
                    ))
                    : Array.from({length: GUESS_LENGTH}, (_, index) => (
                      <EmptyGuessTile
                        key={`placeholder-slot-${rowIndex}-${index}`}
                        rowIndex={rowIndex}
                        index={index}
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
