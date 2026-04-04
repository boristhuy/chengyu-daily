import {usePuzzleGame} from "../hooks/usePuzzleGame";
import {useGameOverDialog} from "../hooks/useGameOverDialog";
import {GameHeader} from "../components/GameHeader";
import {GuessGrid} from "../components/GuessGrid";
import {CharacterPool} from "../components/CharacterPool";
import {GameOverDialog} from "../components/GameOverDialog";

export default function HomePage() {
  const {
    puzzle,
    currentGuess,
    isGameOver,
    selectCharacter,
    removeCharacter,
    submitCurrentGuess,
  } = usePuzzleGame();

  const dialog = useGameOverDialog(isGameOver);

  if (!puzzle) {
    return;
  }

  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-2xl">
        <GameHeader/>

        <div className="mt-8 space-y-5 sm:space-y-6">
          <section className="ui-game-board">
            <GuessGrid
              history={puzzle.guesses}
              currentGuess={currentGuess}
              isGameOver={isGameOver}
              onRemoveCharacter={removeCharacter}
            />
          </section>

          <section className="ui-control-panel">
            <CharacterPool
              puzzle={puzzle}
              currentGuess={currentGuess}
              isGameOver={isGameOver}
              onSelectCharacter={selectCharacter}
              onSubmitGuess={submitCurrentGuess}
              onOpenResults={dialog.openDialog}
            />
          </section>
        </div>
      </section>

      <GameOverDialog
        puzzle={puzzle}
        isOpen={dialog.isOpen}
        isVisible={dialog.isVisible}
        onClose={dialog.closeDialog}
      />
    </main>
  );
}
