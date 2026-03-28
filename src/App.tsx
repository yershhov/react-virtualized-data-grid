import "./App.css";
import { GridPanel } from "./components/GridPanel";
import { COLUMN_COUNT, COLUMNS, getGridDataset, ROW_COUNT } from "./gridData";

function App() {
  const rows = getGridDataset(COLUMNS);
  const totalCellCount = rows.length * COLUMNS.length;
  const rowCountLabel = ROW_COUNT.toLocaleString();
  const columnCountLabel = COLUMN_COUNT.toLocaleString();
  const totalCellCountLabel = totalCellCount.toLocaleString();

  return (
    <main className="app-shell">
      <section className="panel-shell hero-panel">
        <p className="eyebrow">DOM pressure test</p>
        <h1 className="hero-title">
          {rowCountLabel} rows. {columnCountLabel} columns.
        </h1>
        <p className="hero-copy">
          The demo keeps a large dataset in memory, but only renders the row and
          column window that intersects the viewport plus a small overscan
          buffer.
        </p>
        <div className="stats-strip" aria-label="dataset statistics">
          <article className="stat-card">
            <span className="stat-label">Rows</span>
            <strong className="stat-value">{rowCountLabel}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Columns</span>
            <strong className="stat-value">{columnCountLabel}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Cells</span>
            <strong className="stat-value">{totalCellCountLabel}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Render mode</span>
            <strong className="stat-value">2-axis virtualization</strong>
          </article>
        </div>
      </section>
      <GridPanel columns={COLUMNS} rows={rows} />
    </main>
  );
}

export default App;
