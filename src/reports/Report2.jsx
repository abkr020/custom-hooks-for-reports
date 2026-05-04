import React from "react";
import useReportFetchWithFilter from "../hooks/useReportFetchWithFilter";

const Report2 = () => {
    const url = "https://jsonplaceholder.typicode.com/users";

    const { data, loading, error, InpurLimitComponent } =
        useReportFetchWithFilter(url);



    return (
        <div>
            <h2>Report 2 (Users)</h2>

            {InpurLimitComponent()}
            {RenderSearchInputComponent()}

            {/* loading indicator (non-blocking) */}
            {loading && <p style={{ color: "blue" }}>Loading...</p>}

            {/* error */}
            {error && <p style={{ color: "red" }}>{error}</p>}


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