# chengyu-daily
A small, coffee-break web game to learn Chinese idioms (成语) through deduction.

---

## Overview

This is a fast, puzzle-based learning game inspired by games like *Loldle*.

The player is given a small pool of Chinese characters and must reconstruct the correct 4-character chengyu using feedback from each attempt.

The goal is to solve the puzzle within 6 attempts, ideally in as few attempts as possible.

---

## Core Game Loop

1. Show a pool of 8–10 Chinese characters in random order
2. Player selects 4 characters in sequence to form a guess
3. Submit guess
4. Show slot-by-slot feedback:
    - 🟢 Green: correct character, correct position
    - 🟠 Orange: correct character, wrong position
    - 🔴 Red: character not in the answer
5. Increase attempt count by 1
6. Clues are revealed automatically as the player makes guesses (do not increase attempt count)
7. Repeat until the correct chengyu is found or all 6 guesses are used

There is a **hard limit of 6 guesses**.

---

## Design Goals

- Fast to play (3–8 minutes)
- Feels like a puzzle, not a quiz
- Accessible even without strong chengyu knowledge
- Teaches meaning and usage after solving
- Easy to extend later (daily mode, better clues, visuals)

---

## MVP Rules

### Puzzle Structure

Each puzzle contains:
- Exactly 1 target chengyu
- Always 4 characters
- A pool of 8–10 characters
- All answer characters must be present in the pool

---

### Guessing

- Player selects 4 characters from the pool
- Selection order matters
- Each submitted guess increases `attemptCount` by 1
- A puzzle allows a maximum of 6 submitted guesses

---

### Clues

- Clues are free
- Clues are revealed automatically based on the number of guesses
- Clues do **not** increase `attemptCount`

---

### Winning

- The game is solved when the guess exactly matches the target chengyu within 6 guesses

---

### Failure

- The game fails when the player uses all 6 guesses without finding the target chengyu

---

## Scoring

Primary score:

> Solved in X attempts

Lower is better.

Possible future extensions:
- Stars
- Daily ranking
- Streaks
- Perfect solve badges

---

## Why A 6-Guess Limit

Chengyu are more challenging than typical word or trivia games.

The six-guess cap keeps the game concise while still leaving room to learn:
- Less frustration
- Better learning experience
- Natural use of clues

Players are still incentivized to optimize because fewer attempts yield better scores.

---

## Feedback Rules

For each of the 4 positions:

- 🟢 Green → correct character, correct position
- 🟠 Orange → character exists elsewhere in the target
- 🔴 Red → character not in the target

---

## MVP Simplification

For the first version:

> Only use chengyu with **4 distinct characters**

This avoids duplicate-character edge cases and keeps feedback logic simple.

### Example valid target
- 画蛇添足

### Avoid for MVP
- Chengyu with repeated characters

---

## Tech Stack

- React Router v7 (full-stack React on Cloudflare Workers)
- TypeScript
- Tailwind CSS v4
- Vite
- pnpm

---

## Constraints

- Keep implementation simple and readable
- No overengineering
- No unnecessary dependencies

---

## Non-Goals (MVP)

- No authentication
- No database
- No multiplayer
- No CMS
- No monetization

---

## Development Notes (for AI agents)

- Use **pnpm**, not npm
- Always work in small, incremental steps
- Prefer creating **small pull requests** over large changes
- Keep code simple, readable, and easy to review

### Code & Architecture
- Do not introduce unnecessary abstractions
- Avoid overengineering or premature optimization
- Favor clear and explicit logic over clever solutions
- Keep files reasonably small and focused

### UI / UX
- UI must be clean, minimal, and distraction-free
- Support both **desktop and mobile** layouts
- Use simple layouts (cards, spacing, clear hierarchy)
- Prioritize readability of Chinese characters (large, well-spaced text)

### Game Design Constraints
- Keep game interactions fast and responsive
- Do not add extra mechanics beyond the defined MVP
- Preserve the core loop exactly as described in the README

### Dependencies
- Do not add dependencies unless strictly necessary
- Prefer built-in or lightweight solutions

### General
- This is a **1-day MVP**
- Prioritize “working and simple” over “perfect and complete”
- When unsure, choose the simplest implementation

## Definition of Done

A feature or task is considered complete when:

### Functionality
- The feature works end-to-end as described in the README
- Core game loop remains intact and unbroken
- No obvious bugs in normal usage

### UI / UX
- UI is clean, minimal, and consistent
- Works on both **desktop and mobile**
- Layout is stable (no major visual glitches)
- Interactions are clear and responsive

### Code Quality
- Code is simple, readable, and well-structured
- No unnecessary complexity or unused code
- Follows existing project patterns

### Integration
- Feature integrates cleanly with existing code
- Does not break existing functionality

### Developer Experience
- App runs locally without errors
- No broken build or runtime issues

### Git / Review
- Changes are delivered in a **small, focused pull request**
- PR is easy to review and understand
- Commit messages are clear

### Scope Control
- Only implements what is required for the MVP
- No extra features or scope creep

### Git Conventions

- Use clear, concise commit messages
- Format: `type: short description`

Examples:
- feat: add character selection component
- fix: correct feedback logic for guesses
- ui: improve layout for mobile
- refactor: simplify game state handling
- Keep commits small and focused
- One logical change per commit

---

## Setup & Deployment

### Prerequisites

- Node.js 20+
- `pnpm`
- A Cloudflare account with Wrangler authenticated

### Install

```bash
pnpm install
```

### Run Locally

```bash
pnpm dev
```

The app will start in local development mode and serve the homepage at `/`.

### Build

```bash
pnpm build
```

### Preview Cloudflare Worker Locally

```bash
pnpm preview
```

This uses Wrangler to serve the built app with the Cloudflare Workers configuration.

### Deploy

```bash
pnpm deploy
```

If this is your first deployment, authenticate Wrangler first:

```bash
pnpm dlx wrangler login
```
