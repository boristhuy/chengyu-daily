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

export function GuessGrid({history, currentGuess, isGameOver, onRemoveCharacter}: GuessGridProps) {
  const guessSlots = buildGuessSlots(currentGuess);
  const activeRowIndex = isGameOver ? -1 : history.length;

  const feedbackStatusClasses: Record<GuessFeedbackStatus, string> = {
    correct: "ui-feedback-correct",
    present: "ui-feedback-present",
    absent: "border-transparent bg-zinc-700 text-zinc-100",
  };

  return (
    <section>
      <ol className="grid justify-center gap-1.5">
        {Array.from({length: MAX_GUESSES}, (_, rowIndex) => {
          const guess = history[rowIndex];
          const isActiveRow = rowIndex === activeRowIndex;

          return (
            <li key={`attempt-row-${rowIndex + 1}`}>
              <div className="flex justify-center gap-1.5">
                {guess ? (
                  guess.feedback.map((slot) => (
                    <div
                      key={`${guess.attemptNumber}-${slot.index}`}
                      className={[
                        "ui-tile ui-tile-guess",
                        feedbackStatusClasses[slot.status],
                      ].join(" ")}
                    >
                      {slot.character}
                    </div>
                  ))
                ) : isActiveRow ? (
                  guessSlots.map((character, index) => (
                    <button
                      key={`guess-slot-${rowIndex}-${index}-${character ?? "empty"}`}
                      type="button"
                      onClick={() => onRemoveCharacter(index)}
                      disabled={!character || isGameOver}
                      className={[
                        "ui-tile ui-tile-guess",
                        "transition-colors",
                        character ? "ui-tile-guess-filled" : "ui-tile-guess-empty",
                        character ? "animate-guess-slot-pop" : "",
                        !character || isGameOver ? "disabled:cursor-default" : "",
                      ].join(" ")}
                    >
                      {character ?? ""}
                    </button>
                  ))
                ) : (
                  Array.from({length: GUESS_LENGTH}, (_, index) => (
                    <div
                      key={`placeholder-slot-${rowIndex}-${index}`}
                      className="ui-tile ui-tile-guess ui-tile-placeholder"
                    />
                  ))
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
