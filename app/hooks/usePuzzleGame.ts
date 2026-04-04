import {useEffect, useState} from "react";
import {createPuzzle, Puzzle, submitGuess} from "../game";

const GUESS_LENGTH = 4;

export function usePuzzleGame() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);

  useEffect(() => {
    setPuzzle(createPuzzle());
  }, []);

  function selectCharacter(character: string) {
    if (!puzzle || puzzle.isSolved || puzzle.isFailed) {
      return;
    }

    setCurrentGuess(guess => [...guess, character]);
  }

  function removeCharacter(index: number) {
    if (!puzzle || puzzle.isSolved || puzzle.isFailed) {
      return;
    }

    setCurrentGuess(guess =>
      guess.filter((_, guessIndex) => guessIndex !== index)
    );
  }

  function submitCurrentGuess() {
    if (!puzzle || puzzle.isSolved || puzzle.isFailed || currentGuess.length !== GUESS_LENGTH) {
      return;
    }

    const guessResult = submitGuess(puzzle, currentGuess.join(""));
    if (!guessResult.ok) {
      console.log(guessResult.error);
      return;
    }

    setPuzzle(guessResult.puzzle);
    setCurrentGuess([]);
  }

  const isGameOver = puzzle?.isSolved || puzzle?.isFailed || false;

  return {
    puzzle,
    currentGuess,
    isGameOver,
    selectCharacter,
    removeCharacter,
    submitCurrentGuess,
  };
}