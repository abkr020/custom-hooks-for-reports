import React, { useState } from "react";

const CreateTableColumnsAndMapping = () => {
  const [columns, setColumns] = useState([
    {
      id: Date.now(),
      header: "ID",
      accessor: "id",
    },
  ]);

  // ADD ROOT COLUMN
  const addColumn = () => {
    setColumns((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        header: "",
        accessor: "",
      },
    ]);
  };

  // ADD CHILD COLUMN
  const addChildColumn = (parentId) => {
    const updated = columns.map((col) => {
      if (col.id === parentId) {
        return {
          ...col,
          children: [
            ...(col.children || []),
            {
              id: Date.now() + Math.random(),
              header: "",
              accessor: "",
            },
          ],
        };
      }

      return col;
    });

    setColumns(updated);
  };

  // UPDATE ROOT COLUMN
  const updateColumn = (id, field, value) => {
    const updated = columns.map((col) => {
      if (col.id === id) {
        return {
          ...col,
          [field]: value,
        };
      }

      if (col.children) {
        return {
          ...col,
          children: col.children.map((child) =>
            child.id === id
              ? {
                  ...child,
                  [field]: value,
                }
              : child
          ),
        };
      }

      return col;
    });

    setColumns(updated);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Table Columns</h2>

      <button onClick={addColumn}>+ Add Column</button>

      <div style={{ marginTop: "20px" }}>
        {columns.map((col) => (
          <div
            key={col.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <h3>Parent Column</h3>

            <input
              type="text"
              placeholder="Header"
              value={col.header}
              onChange={(e) =>
                updateColumn(col.id, "header", e.target.value)
              }
              style={{ marginRight: "10px" }}
            />

            {!col.children && (
              <input
                type="text"
                placeholder="Accessor"
                value={col.accessor}
                onChange={(e) =>
                  updateColumn(col.id, "accessor", e.target.value)
                }
              />
            )}

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => addChildColumn(col.id)}>
                + Add Child Column
              </button>
            </div>

            {/* CHILD COLUMNS */}
            {col.children?.length > 0 && (
              <div
                style={{
                  marginTop: "15px",
                  marginLeft: "20px",
                  borderLeft: "3px solid #ddd",
                  paddingLeft: "15px",
                }}
              >
                <h4>Child Columns</h4>

                {col.children.map((child) => (
                  <div
                    key={child.id}
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Child Header"
                      value={child.header}
                      onChange={(e) =>
                        updateColumn(child.id, "header", e.target.value)
                      }
                      style={{ marginRight: "10px" }}
                    />

                    <input
                      type="text"
                      placeholder="Accessor"
                      value={child.accessor}
                      onChange={(e) =>
                        updateColumn(child.id, "accessor", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* OUTPUT */}
      <div style={{ marginTop: "30px" }}>
        <h2>Generated Structure</h2>

        <pre
          style={{
            background: "#f4f4f4",
            padding: "15px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(columns, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CreateTableColumnsAndMapping;