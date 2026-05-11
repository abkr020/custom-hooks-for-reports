import React from "react";

const ReportWrapper = ({
  title,
  reportWrapperItems,
  loading,
  error,
  children,
}) => {
  const filterComponents =
    reportWrapperItems?.filters || [];
  return (
    <div style={{ border: "2px solid #333", padding: "10px" }}>
      <h2>{title}</h2>

      {/* FILTERS SECTION */}
      <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        {filterComponents.map(
          (Component, index) => (
            <React.Fragment key={index}>
              {Component?.()}
            </React.Fragment>
          )
        )}
      </div>

      {/* LOADING */}
      {loading && <p style={{ color: "blue" }}>Loading...</p>}

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* TABLE / CONTENT */}
      {children}
      {reportWrapperItems?.PaginationComponent?.()}
    </div>
  );
};

export default ReportWrapper;