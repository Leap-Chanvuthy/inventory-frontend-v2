import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  initScope,
  setMode,
  toggle,
  selectSingle,
  addMany,
  clearScope,
  selectScope,
  selectSelectedIds,
  selectSelectedItems,
} from "@/redux/slices/selection-slice";

type MockEntity = {
  id: string;
  name: string;
  type: "User" | "Product";
};

export default function MockSelection() {
  const dispatch = useDispatch();

  const [scopeKey, setScopeKey] = useState("users");
  const scoped = useSelector((s) => selectScope(s as any, scopeKey));
  const ids = useSelector((s) => selectSelectedIds(s as any, scopeKey));
  const items = useSelector((s) => selectSelectedItems(s as any, scopeKey));

  const mockData: MockEntity[] = useMemo(
    () => [
      { id: "1", name: "Alice", type: "User" },
      { id: "2", name: "Bob", type: "User" },
      { id: "p-10", name: "Keyboard", type: "Product" },
      { id: "p-11", name: "Mouse", type: "Product" },
    ],
    []
  );

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ marginBottom: 8 }}>Selection Slice Mock</h2>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Tests scoped selection (single/multiple) with IDs + payload cache.
      </p>

      <div style={{ display: "grid", gap: 12, maxWidth: 900 }}>
        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Scope:
            <input
              value={scopeKey}
              onChange={(e) => setScopeKey(e.target.value)}
              placeholder="e.g. users | products"
              style={{ padding: 6, minWidth: 220 }}
            />
          </label>

          <button
            onClick={() => dispatch(initScope({ scope: scopeKey, mode: "multiple" }))}
          >
            Init scope (multiple)
          </button>

          <button
            onClick={() => dispatch(initScope({ scope: scopeKey, mode: "single" }))}
          >
            Init scope (single)
          </button>

          <button
            onClick={() =>
              dispatch(
                setMode({
                  scope: scopeKey,
                  mode: scoped.mode === "single" ? "multiple" : "single",
                })
              )
            }
          >
            Toggle mode (current: {scoped.mode})
          </button>

          <button onClick={() => dispatch(clearScope({ scope: scopeKey }))}>
            Clear scope
          </button>

          <button
            onClick={() =>
              dispatch(
                addMany({
                  scope: scopeKey,
                  items: mockData.slice(0, 3).map((x) => ({ id: x.id, payload: x })),
                })
              )
            }
          >
            AddMany (first 3)
          </button>
        </div>

        {/* Mock rows */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Mock rows</h3>

          <div style={{ display: "grid", gap: 8 }}>
            {mockData.map((row) => {
              const selected = ids.includes(row.id);
              return (
                <div
                  key={row.id}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: selected ? "rgba(99, 79, 209, 0.10)" : "transparent",
                    border: "1px solid #eee",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      dispatch(
                        toggle({
                          scope: scopeKey,
                          item: { id: row.id, payload: row },
                        })
                      )
                    }
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>
                      {row.name} <span style={{ opacity: 0.65 }}>({row.type})</span>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>id: {row.id}</div>
                  </div>

                  <button
                    onClick={() =>
                      dispatch(selectSingle({ scope: scopeKey, item: { id: row.id, payload: row } }))
                    }
                  >
                    SelectSingle
                  </button>

                  <button
                    onClick={() =>
                      dispatch(toggle({ scope: scopeKey, item: { id: row.id, payload: row } }))
                    }
                  >
                    Toggle
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* State dump */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Selected IDs</h3>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(ids, null, 2)}
            </pre>
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Selected items (id + payload)</h3>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(items, null, 2)}
            </pre>
          </div>
        </div>

        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Note: this assumes <code>selectionSlice.reducer</code> is registered in your Redux store under
          the key <code>selection</code>.
        </div>
      </div>
    </div>
  );
}