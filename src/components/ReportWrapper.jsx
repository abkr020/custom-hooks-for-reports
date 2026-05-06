import React from "react";

const ReportWrapper = ({
  title,
  reportWrapperItems,
  loading,
  error,
  children,
}) => {
  return (
    <div style={{ border: "2px solid #333", padding: "10px" }}>
      <h2>{title}</h2>

      {/* FILTERS SECTION */}
      <div style={{ marginBottom: "15px" , display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem"}}>
        {reportWrapperItems?.InpurLimitComponent?.()}
        {reportWrapperItems?.RenderSearchInputComponent?.()}
           {/* ✅ EXPORT BUTTON */}
        <button onClick={reportWrapperItems?.exportToExcel} >
          Download Excel
        </button>
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