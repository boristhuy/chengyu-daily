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
  attemptNumber: number;
  index: number;
  character: string;
  status: GuessFeedbackStatus;
};

function FeedbackTile({attemptNumber, index, character, status}: FeedbackTileProps) {
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

function EditableTile({rowIndex, index, character, isGameOver, onRemoveCharacter}: EditableTileProps) {
  const tileStateClass = character ? "ui-tile-guess-filled" : "ui-tile-guess-empty";
  const animationClass = character ? "animate-guess-slot-pop" : "";
  const disabledClass = !character || isGameOver ? "disabled:cursor-default" : "";

  return (
    <button
      key={`guess-slot-${rowIndex}-${index}-${character ?? "empty"}`}
      type="button"
      onClick={() => onRemoveCharacter(index)}
      disabled={!character || isGameOver}
      className={[
        "ui-tile ui-tile-guess",
        "transition-colors",
        tileStateClass,
        animationClass,
        disabledClass,
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

function PlaceholderTile({rowIndex, index}: PlaceholderTileProps) {
  return (
    <div
      key={`placeholder-slot-${rowIndex}-${index}`}
      className="ui-tile ui-tile-guess ui-tile-placeholder"
    />
  );
}

function GuessRow({
  rowIndex,
  guess,
  guessSlots,
  isActiveRow,
  isGameOver,
  onRemoveCharacter,
}: {
  rowIndex: number;
  guess: GuessResult | undefined;
  guessSlots: Array<string | null>;
  isActiveRow: boolean;
  isGameOver: boolean;
  onRemoveCharacter: (index: number) => void;
}) {
  return (
    <li key={`attempt-row-${rowIndex + 1}`}>
      <div className="flex justify-center gap-1.5">
        {guess
          ? guess.feedback.map((slot) => (
            <FeedbackTile
              key={`${guess.attemptNumber}-${slot.index}`}
              attemptNumber={guess.attemptNumber}
              index={slot.index}
              character={slot.character}
              status={slot.status}
            />
          ))
          : isActiveRow
            ? guessSlots.map((character, index) => (
              <EditableTile
                key={`guess-slot-${rowIndex}-${index}-${character ?? "empty"}`}
                rowIndex={rowIndex}
                index={index}
                character={character}
                isGameOver={isGameOver}
                onRemoveCharacter={onRemoveCharacter}
              />
            ))
            : Array.from({length: GUESS_LENGTH}, (_, index) => (
              <PlaceholderTile
                key={`placeholder-slot-${rowIndex}-${index}`}
                rowIndex={rowIndex}
                index={index}
              />
            ))}
      </div>
    </li>
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
            <GuessRow
              key={`attempt-row-${rowIndex + 1}`}
              rowIndex={rowIndex}
              guess={guess}
              guessSlots={guessSlots}
              isActiveRow={isActiveRow}
              isGameOver={isGameOver}
              onRemoveCharacter={onRemoveCharacter}
            />
          );
        })}
      </ol>
    </section>
  );
}
