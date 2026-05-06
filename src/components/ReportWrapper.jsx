import React from "react";

const ReportWrapper = ({
  title,
  filters,
  loading,
  error,
  children,
}) => {
  return (
    <div style={{ border: "2px solid #333", padding: "10px" }}>
      <h2>{title}</h2>

      {/* FILTERS SECTION */}
      <div style={{ marginBottom: "15px" , display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem"}}>
        {filters?.InpurLimitComponent?.()}
        {filters?.RenderSearchInputComponent?.()}
      </div>

      {/* LOADING */}
      {loading && <p style={{ color: "blue" }}>Loading...</p>}

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* TABLE / CONTENT */}
      {children}
      {filters?.PaginationComponent?.()}
    </div>
  );
};

export default ReportWrapper;