# Game of Life

An interactive implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) built with React.

**Live demo:** https://the-game-of-life.netlify.app/

## Features

- **Draw & erase** cells on the grid using click or click-and-drag
- **Shift** the board in any direction
- **Adjustable simulation speed** via interval control
- **Share boards** using compressed URL codes
- **Board history** — states are auto-saved when the simulation starts and can be restored
- **Stasis detection** — simulation stops automatically when the board reaches a stable or empty state

## Getting Started

### Prerequisites

- Node.js
- Yarn

### Install

```bash
yarn install
```

### Run (development)

```bash
yarn start
```

Opens a dev server at `http://localhost:8080` with hot reloading.

### Build (production)

```bash
yarn build
```

Output is written to `dist/`.

## How to Use

1. **Draw** cells on the grid by clicking or dragging
2. Press **Play** to start the simulation
3. Use **Pause** to pause and continue drawing
4. Press **Reset** to clear the board
5. Copy the **board code** or shareable link to save or share your pattern
6. Paste a board code into the loader to restore a pattern

## Rules

Conway's Game of Life follows four rules:

1. A live cell with fewer than 2 live neighbours dies (underpopulation)
2. A live cell with 2 or 3 live neighbours survives
3. A live cell with more than 3 live neighbours dies (overpopulation)
4. A dead cell with exactly 3 live neighbours becomes alive (reproduction)

## Tech Stack

- [React](https://reactjs.org/)
- [Webpack](https://webpack.js.org/)
- [SCSS](https://sass-lang.com/) with CSS Modules
- [pako](https://github.com/nodeca/pako) + [base-64](https://github.com/mathiasbynens/base64) for board compression
- [crc-32](https://github.com/SheetJS/js-crc32) for stasis detection

## License

MIT
