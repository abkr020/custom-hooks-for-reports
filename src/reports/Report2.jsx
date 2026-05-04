import React from "react";
import useReportFetchWithFilter from "../hooks/useReportFetchWithFilter";

const Report2 = () => {
  const url = "https://jsonplaceholder.typicode.com/users";

  const { data, loading, error, InpurLimitComponent } =
    useReportFetchWithFilter(url);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Report 2 (Users)</h2>

      <InpurLimitComponent />

      {data?.map((user) => (
        <div key={user.id} style={{ marginBottom: "15px" }}>
          <h4>{user.name}</h4>
          {/* <p>{user.email}</p> */}
          {/* <p>{user.company?.name}</p> */}
        </div>
      ))}
    </div>
  );
};

export default Report2;