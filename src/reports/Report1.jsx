import React from 'react'
import useReportFetchWithFilter from '../hooks/useReportFetchWithFilter';

const Report1 = () => {
const url = "https://jsonplaceholder.typicode.com/posts?_limit=10";
  const { data, loading, error } = useReportFetchWithFilter(url);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      report 1
      {data?.map((item) => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          <h4>{item.title}</h4>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  )
}

export default Report1
