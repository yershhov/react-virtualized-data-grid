# Virtualized Grid Tryout

This project is a React + TypeScript playground for learning grid virtualization.
It started as a deliberately naive data grid that tried to mount every row and
every cell in the DOM. With large row and column counts, that approach quickly
turns scrolling into a rendering bottleneck.

## Start here

If you are reading the code, jump straight to these two files first:

- [`src/components/Grid.tsx`](src/components/Grid.tsx) contains the grid rendering path
- [`src/hooks/useGridVirtualization.ts`](src/hooks/useGridVirtualization.ts) contains the viewport measurement, scroll tracking, and virtualization math

The rest of the app is mostly presentation and demo scaffolding. In particular,
[`src/components/GridPanel.tsx`](src/components/GridPanel.tsx) is just the
surrounding panel chrome.

## The initial problem

The original grid rendered:

- every row in the dataset
- every column for every visible row
- one DOM node per cell, plus row and header wrappers

That means the DOM pressure grows with the full dataset size:

```text
rowCount * columnCount
```

Even if the viewport only shows a small slice of the table, the browser still
has to manage the full rendered tree.

## What the current solution does

The grid now virtualizes both axes:

- vertical virtualization renders only the visible rows plus overscan
- horizontal virtualization renders only the visible columns plus overscan
- the scroll container keeps the full scrollable width and height
- translated inner tracks place the rendered slice at the correct position

In practice, the browser renders roughly:

```text
(visibleRows + overscan buffer) * (visibleColumns + overscan buffer)
```

instead of the full dataset.

Important: this demo is focused on DOM virtualization. The dataset is still
generated in memory up front, so very large row and column counts will also
increase startup cost, not just render cost.

## Project structure

- `src/components/GridPanel.tsx` holds the surrounding panel copy
- `src/components/Grid.tsx` renders the grid DOM
- `src/hooks/useGridVirtualization.ts` owns measurement, scroll tracking, and visible-range math
- `src/gridData.ts` defines dataset size, cell sizing, and generated data

## Run locally

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd virtualization_tryout
npm install
```

Start the dev server:

```bash
npm run dev
```

Build a production bundle:

```bash
npm run build
```

Lint the project:

```bash
npm run lint
```

## Try different scenarios

Edit the constants at the top of `src/gridData.ts`.

The current checked-in values are intentionally aggressive: `100_000` rows and
`10_000` columns.

Because the dataset is still generated eagerly in memory, a smaller first-run
scenario like `10_000` rows and `30` to `100` columns is a safer place to
start when profiling locally.

- `ROW_COUNT` changes the vertical pressure
- `COLUMN_COUNT` changes the horizontal pressure
- `COLUMN_WIDTH` changes how quickly horizontal scrolling kicks in
- `ROW_HEIGHT` changes how many rows fit into the viewport
- `OVERSCAN` changes how many extra rows and columns are rendered around the viewport

Example scenarios:

- many rows, moderate columns: stress vertical virtualization
- moderate rows, many columns: stress horizontal virtualization
- larger overscan: smoother scrolling, more DOM nodes
- smaller overscan: fewer DOM nodes, more frequent slice updates
