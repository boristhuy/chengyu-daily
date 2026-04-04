import {useEffect, useState} from "react";

const DIALOG_TRANSITION_MS = 180;

type UseGameOverDialogResult = {
  isOpen: boolean;
  isVisible: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

export function useGameOverDialog(isGameOver: boolean): UseGameOverDialogResult {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isGameOver) {
      setIsOpen(true);
    }
  }, [isGameOver]);

  useEffect(() => {
    let frameId: number | null = null;

    if (isOpen) {
      frameId = requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isOpen]);

  function openDialog() {
    if (!isGameOver) {
      return;
    }
    setIsOpen(true);
  }

  function closeDialog() {
    setIsVisible(false);

    setTimeout(() => {
      setIsOpen(false);
    }, DIALOG_TRANSITION_MS);
  }

  return {
    isOpen,
    isVisible,
    openDialog,
    closeDialog,
  };
}