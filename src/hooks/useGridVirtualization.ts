import {
  type RefObject,
  type UIEventHandler,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  COLUMN_WIDTH,
  OVERSCAN,
  ROW_HEIGHT,
  type GridColumn,
  type GridRow,
} from "../gridData";

type UseGridVirtualizationArgs = {
  columns: GridColumn[];
  rows: GridRow[];
  viewportRef: RefObject<HTMLDivElement | null>;
};

type VirtualSlice<T> = {
  items: T[];
  offset: number;
};

type ScrollPosition = {
  left: number;
  top: number;
};

type ViewportSize = {
  height: number;
  width: number;
};

type GridVirtualizationResult = {
  bodyHeight: number;
  bodyWidth: number;
  columnOffset: number;
  handleScroll: UIEventHandler<HTMLDivElement>;
  rowOffset: number;
  visibleColumns: GridColumn[];
  visibleRows: GridRow[];
};

type VirtualSliceArgs<T> = {
  itemSize: number;
  items: T[];
  scrollOffset: number;
  viewportSize: number;
};

function getVirtualSlice<T>({
  itemSize,
  items,
  scrollOffset,
  viewportSize,
}: VirtualSliceArgs<T>): VirtualSlice<T> {
  const visibleItemCount = Math.max(1, Math.ceil(viewportSize / itemSize));
  const startIndex = Math.floor(scrollOffset / itemSize);
  const endIndex = startIndex + visibleItemCount;

  const from = Math.max(0, startIndex - OVERSCAN);
  const to = Math.min(items.length, endIndex + OVERSCAN);

  return {
    items: items.slice(from, to),
    offset: from * itemSize,
  };
}

export function useGridVirtualization({
  columns,
  rows,
  viewportRef,
}: UseGridVirtualizationArgs): GridVirtualizationResult {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    left: 0,
    top: 0,
  });
  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    height: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measureViewport = () => {
      setViewportSize({
        height: viewport.clientHeight,
        width: viewport.clientWidth,
      });
    };

    measureViewport();

    const resizeObserver = new ResizeObserver(measureViewport);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, [viewportRef]);

  // Substract a header row as it's placed inside the grid viewport
  const bodyViewportHeight = viewportSize.height - ROW_HEIGHT;

  const rowSlice = useMemo(
    () =>
      getVirtualSlice({
        itemSize: ROW_HEIGHT,
        items: rows,
        scrollOffset: scrollPosition.top,
        viewportSize: bodyViewportHeight,
      }),
    [bodyViewportHeight, rows, scrollPosition.top],
  );

  const columnSlice = useMemo(
    () =>
      getVirtualSlice({
        itemSize: COLUMN_WIDTH,
        items: columns,
        scrollOffset: scrollPosition.left,
        viewportSize: viewportSize.width,
      }),
    [viewportSize.width, columns, scrollPosition.left],
  );

  const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {
    const viewport = event.currentTarget;

    setScrollPosition({
      left: viewport.scrollLeft,
      top: viewport.scrollTop,
    });
  };

  return {
    bodyHeight: rows.length * ROW_HEIGHT,
    bodyWidth: columns.length * COLUMN_WIDTH,
    columnOffset: columnSlice.offset,
    handleScroll,
    rowOffset: rowSlice.offset,
    visibleColumns: columnSlice.items,
    visibleRows: rowSlice.items,
  };
}
