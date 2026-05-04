import React from 'react'
import useReportFetchWithFilter from '../hooks/useReportFetchWithFilter';

const Report1 = () => {
  const url = "https://jsonplaceholder.typicode.com/posts";
  const { data, loading, error, InpurLimitComponent,RenderSearchInputComponent } = useReportFetchWithFilter(url);

  return (
    <div>
      report 1
   
        {/* inputs ALWAYS visible */}
      {InpurLimitComponent()}
      {RenderSearchInputComponent()}

      {/* loading indicator (non-blocking) */}
      {loading && <p style={{ color: "blue" }}>Loading...</p>}

      {/* error */}
      {error && <p style={{ color: "red" }}>{error}</p>}


      {data?.map((item) => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          <h4>{item.title}</h4>
          {/* <p>{item.body}</p> */}
        </div>
      ))}
    </div>
  )
}

export default Report1
