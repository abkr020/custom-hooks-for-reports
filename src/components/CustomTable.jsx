import React from "react";

// ✅ Flatten columns for body
export const getLeafColumns = (cols) => {
    return cols.flatMap((col) =>
        col.children ? getLeafColumns(col.children) : col
    );
};

// ✅ Get nested value safely
export const getValue = (obj, path) => {
    if (!path) return "";
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
};
const CustomTable = ({ columns, data, loading, handleSort, sortBy, sortOrder }) => {
    // ✅ Get max depth of header tree
    const getMaxDepth = (cols) => {
        return Math.max(
            ...cols.map((col) =>
                col.children ? 1 + getMaxDepth(col.children) : 1
            )
        );
    };

    // ✅ Count leaf columns (for colSpan)
    const countLeafColumns = (cols) => {
        return cols.reduce((acc, col) => {
            return acc + (col.children ? countLeafColumns(col.children) : 1);
        }, 0);
    };

    // ✅ Build header rows (with correct rowSpan)
    const buildHeaderRows = (cols, maxDepth, depth = 0, rows = []) => {
        rows[depth] = rows[depth] || [];

        cols.forEach((col) => {
            const cell = {
                header: col.header,
                accessor: col.accessor, // ✅ important
                colSpan: col.children
                    ? countLeafColumns(col.children)
                    : 1,
                rowSpan: col.children ? 1 : maxDepth - depth, // ✅ FIXED
            };

            rows[depth].push(cell);

            if (col.children) {
                buildHeaderRows(col.children, maxDepth, depth + 1, rows);
            }
        });

        return rows;
    };


    const maxDepth = getMaxDepth(columns);
    const headerRows = buildHeaderRows(columns, maxDepth);
    const leafColumns = getLeafColumns(columns);
    console.log("headerRows leafColumns", headerRows, leafColumns);

    return (
        <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", borderCollapse: "collapse" }}
        >
            {/* ✅ HEADER */}
            <thead>
                {headerRows.map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => (
                            <th key={`${cell.header}-${j}`} colSpan={cell.colSpan} rowSpan={cell.rowSpan}
                                onClick={() => cell.accessor && handleSort(cell)}
                                style={{
                                    cursor: cell.accessor ? "pointer" : "default"
                                }}
                            >
                                {cell.header}
                                {/* sort icon */}
                                {sortBy === cell.accessor &&
                                    (sortOrder === "asc" ? " 🔼" : " 🔽")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>

            {/* ✅ BODY */}
            <tbody>
                {loading ? (
                    <tr>
                        <td
                            colSpan={leafColumns.length}
                            style={{ textAlign: "center" }}
                        >
                            Loading...
                        </td>
                    </tr>
                ) : data?.length > 0 ? (
                    data.map((item) => (
                        <tr key={item.id || JSON.stringify(item)}>
                            {leafColumns.map((col, j) => (
                                <td key={col.accessor || j}>
                                    {col.render
                                        ? col.render(item) // ✅ custom render support
                                        : getValue(item, col.accessor)}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={leafColumns.length} style={{ textAlign: "center" }}>
                            No data found
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default CustomTable;