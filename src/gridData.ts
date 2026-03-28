// Adjust these two numbers to try different rendering scenarios locally.
export const ROW_COUNT = 100_000;
export const COLUMN_COUNT = 10_000;
export const COLUMN_WIDTH = 180;
export const ROW_HEIGHT = 49;
export const OVERSCAN = 5;

export type GridColumn = {
  key: string;
  label: string;
};

export type GridRow = Record<string, number>;
type GridDataset = GridRow[];

const datasetCache = globalThis as typeof globalThis & {
  __heavyTrashbagDatasets__?: Map<string, GridDataset>;
};

export function getGridColumns(columnCount = COLUMN_COUNT): GridColumn[] {
  return Array.from({ length: columnCount }, (_, columnIndex) => ({
    key: `column_${columnIndex + 1}`,
    label: `Column ${String(columnIndex + 1).padStart(2, "0")}`,
  }));
}

export const COLUMNS = getGridColumns();

function xorshift32(seed: number) {
  let state = seed | 0;

  state ^= state << 13;
  state ^= state >>> 17;
  state ^= state << 5;

  return state >>> 0;
}

function createGridDataset(columns: GridColumn[]): GridDataset {
  let state = 0x6d2b79f5;

  return Array.from({ length: ROW_COUNT }, () => {
    const row = {} as GridRow;

    columns.forEach(({ key }) => {
      state = xorshift32(state + 0x9e3779b9);
      row[key] = state;
    });

    return row;
  });
}

export function getGridDataset(columns: GridColumn[] = COLUMNS) {
  datasetCache.__heavyTrashbagDatasets__ ??= new Map();

  const cacheKey = columns.map(({ key }) => key).join("|");
  let dataset = datasetCache.__heavyTrashbagDatasets__.get(cacheKey);

  if (!dataset) {
    dataset = createGridDataset(columns);
    datasetCache.__heavyTrashbagDatasets__.set(cacheKey, dataset);
  }

  return dataset;
}
