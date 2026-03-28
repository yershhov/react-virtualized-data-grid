import { Grid } from "./Grid";
import type { GridColumn, GridRow } from "../gridData";
import "./GridPanel.css";

type GridPanelProps = {
  columns: GridColumn[];
  rows: GridRow[];
};

export function GridPanel({ columns, rows }: GridPanelProps) {
  if (!columns.length || !rows.length) return null;

  return (
    <section className="panel-shell grid-panel">
      <header className="panel-copy">
        <div className="panel-copy-block">
          <p className="panel-kicker">Virtualization Target</p>
          <h2 className="panel-title">Two-axis virtualized grid</h2>
        </div>
        <p className="panel-note">
          The grid only mounts the visible row and column slice, plus overscan,
          so scrolling stays smooth while the dataset stays large.
        </p>
      </header>

      <Grid columns={columns} rows={rows} />
    </section>
  );
}
