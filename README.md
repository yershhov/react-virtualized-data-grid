# Virtualized Table

This project showcases a performance optimization technique called "virtualization".
It started as a deliberately naively huge table, that tried to render a ton of data at once. 
Being too large, that approach quickly turns scrolling into a rendering bottleneck.

## Start here

If you are reading the code, jump straight to these two files first:

- [`src/components/Grid.tsx`](src/components/Grid.tsx) contains the grid rendering path
- [`src/hooks/useGridVirtualization.ts`](src/hooks/useGridVirtualization.ts) contains the viewport measurement, scroll tracking, and virtualization math

## The initial problem

The original grid rendered:

- every row in the dataset
- every column for every visible row
- one DOM node per cell, plus row and header wrappers

That means the DOM pressure grows with the full dataset size:

```text
rowCount * columnCount
```

Even if the viewport can only fit a small slice of the table at once, the browser still
has to manage the full rendered table.

## What the current solution does

The grid now virtualizes both axes:

- vertical virtualization renders only the visible rows plus overscan (5 below and 5 above the currently visible portion)
- horizontal virtualization renders only the visible columns plus overscan (5 on both sides of the currently visible portion)

In practice, the browser now only has to render roughly:

```text
(visibleRows + overscan buffer) * (visibleColumns + overscan buffer)
```

instead of the full dataset.

> [!IMPORTANT]
> This demo is focused on **DOM virtualization**. The demo dataset is still
> generated in memory up front, so very large row and column counts will still
> increase startup cost.

## Project structure

- `src/gridData.ts` defines dataset size, cell sizing, and generated data
- `src/components/GridPanel.tsx` holds the surrounding panel copy
- `src/components/Grid.tsx` renders the grid DOM
- `src/hooks/useGridVirtualization.ts` owns measurement, scroll tracking, and visible-range math

## Run locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/yershhov/react-virtualized-data-grid.git
cd react-virtualized-data-grid
npm install
```

Start the dev server:

```bash
npm run dev
```

## Try different scenarios

Edit the constants at the top of `src/gridData.ts`.

The current checked-in values are intentionally aggressive: `100_000` rows and
`10_000` columns.

Because the dataset is still generated eagerly in memory, a smaller first-run
scenario like `10_000` rows and `100` columns is a safer place to
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
