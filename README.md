# chengyu-daily
A small, coffee-break web game to learn Chinese idioms (成语) through deduction.

---

## Overview

This is a fast, puzzle-based learning game inspired by games like *Loldle*.

The player is given a small pool of Chinese characters and must reconstruct the correct 4-character chengyu using feedback from each attempt.

The goal is to solve the puzzle within 4 attempts, ideally in as few attempts as possible.

---

## Core Game Loop

1. Show a pool of 8–10 Chinese characters in random order
2. Player selects 4 characters in sequence to form a guess
3. Submit guess
4. Show slot-by-slot feedback:
    - 🟢 Green: correct character, correct position
    - 🟠 Orange/Yellow: correct character, wrong position
    - 🔴 Red/Muted: character not in the answer
5. Increase attempt count by 1
6. Clues are revealed automatically as the player makes guesses (do not increase attempt count)
7. Repeat until the correct chengyu is found or all 4 guesses are used

There is a **hard limit of 4 guesses**.

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
- A puzzle allows a maximum of 4 submitted guesses

---

### Clues

- Clues are free
- Clues are revealed automatically based on the number of guesses
- Clues do **not** increase `attemptCount`

---

### Winning

- The game is solved when the guess exactly matches the target chengyu within 4 guesses

---

### Failure

- The game fails when the player uses all 4 guesses without finding the target chengyu

---

## Scoring

Primary score:

> Solved in X attempts

Lower is better.

After a puzzle ends, players can copy a compact spoiler-free share summary from the game-over dialog. The shared text includes the game name, the result as attempts used or `X/4`, and emoji-only feedback rows for each submitted guess.

Possible future extensions:
- Stars
- Daily ranking
- Streaks
- Perfect solve badges

---

## Why A 4-Guess Limit

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
- 🟠 Orange/Yellow → character exists elsewhere in the target
- 🔴 Red/Muted → character not in the target

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
- Keep sharing plain-text and spoiler-free

---

## Non-Goals (MVP)

- No authentication
- No database
- No multiplayer
- No CMS
- No monetization

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
