import React from 'react'
import useReportFetchWithFilter from '../hooks/useReportFetchWithFilter';

const Report1 = () => {
  const url = "https://jsonplaceholder.typicode.com/posts";
  const { data, loading, error, InpurLimitComponent } = useReportFetchWithFilter(url);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      report 1
      <InpurLimitComponent />

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
