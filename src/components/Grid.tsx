import { type CSSProperties, useRef } from "react";
import {
  COLUMN_WIDTH,
  ROW_HEIGHT,
  type GridColumn,
  type GridRow,
} from "../gridData";
import { useGridVirtualization } from "../hooks/useGridVirtualization";
import "./Grid.css";

type GridProps = {
  columns: GridColumn[];
  rows: GridRow[];
};

export function Grid({ columns, rows }: GridProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const {
    bodyHeight,
    bodyWidth,
    columnOffset,
    handleScroll,
    rowOffset,
    visibleColumns,
    visibleRows,
  } = useGridVirtualization({
    columns,
    rows,
    viewportRef,
  });

  const firstRenderedRowIndex = rowOffset / ROW_HEIGHT;
  const visibleTrackStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${visibleColumns.length}, ${COLUMN_WIDTH}px)`,
    width: visibleColumns.length * COLUMN_WIDTH,
  };
  const headerStyle: CSSProperties = {
    width: bodyWidth,
  };
  const bodyStyle: CSSProperties = {
    width: bodyWidth,
    height: bodyHeight,
  };
  const headerTrackStyle: CSSProperties = {
    ...visibleTrackStyle,
    transform: `translateX(${columnOffset}px)`,
  };
  const bodyTrackStyle: CSSProperties = {
    transform: `translate(${columnOffset}px, ${rowOffset}px)`,
  };

  return (
    <div
      ref={viewportRef}
      className="grid-viewport"
      role="grid"
      aria-rowcount={rows.length}
      aria-colcount={columns.length}
      onScroll={handleScroll}
    >
      <div className="grid-header" role="row" style={headerStyle}>
        <div className="grid-track" style={headerTrackStyle}>
          {visibleColumns.map((column) => (
            <div className="grid-column" key={column.key} role="columnheader">
              <span>{column.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-body" role="rowgroup" style={bodyStyle}>
        <div className="grid-body-track" style={bodyTrackStyle}>
          {visibleRows.map((row, rowIndex) => (
            <div
              className="grid-row grid-track"
              key={firstRenderedRowIndex + rowIndex}
              role="row"
              style={visibleTrackStyle}
            >
              {visibleColumns.map((column) => (
                <div className="grid-cell" key={column.key} role="gridcell">
                  {row[column.key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
