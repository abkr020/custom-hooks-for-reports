import React from 'react'
import useReportFetchWithFilter from '../hooks/useReportFetchWithFilter';
import CustomTable from '../components/CustomTable';

const Report1 = () => {
  const productTableolumns = [
    {
      header: "ID",
      accessor: "id",
    },
    {
      header: "Product Info",
      children: [
        {
          header: "Title",
          accessor: "title",
        },
        {
          header: "Category",
          accessor: "category",
        },
        {
          header: "Brand",
          accessor: "brand",
        },
      ],
    },
    {
      header: "Pricing",
      children: [
        {
          header: "Price",
          accessor: "price",
          render: (row) => `$${row.price}`,
        },
        {
          header: "Discount %",
          accessor: "discountPercentage",
          render: (row) => `${row.discountPercentage}%`,
        },
      ],
    },
    {
      header: "Stats",
      children: [
        {
          header: "Rating",
          accessor: "rating",
        },
        {
          header: "Stock",
          accessor: "stock",
          render: (row) => (
            <span style={{ color: row.stock < 10 ? "red" : "green" }}>
              {row.stock}
            </span>
          ),
        },
      ],
    },
    {
      header: "Status",
      accessor: "availabilityStatus",
    },
  ];
  const url = "https://dummyjson.com/products";
  const { data, loading, error, InpurLimitComponent, RenderSearchInputComponent } = useReportFetchWithFilter(url);
  console.log("data--", data);

  return (
    <div style={{ border: "2px solid tomato" }}>
      <h2>Report 1 (Products)</h2>

      {/* inputs ALWAYS visible */}
      {InpurLimitComponent()}
      {RenderSearchInputComponent()}

      {/* loading indicator (non-blocking) */}
      {loading && <p style={{ color: "blue" }}>Loading...</p>}

      {/* error */}
      {error && <p style={{ color: "red" }}>{error}</p>}


      <CustomTable
        columns={productTableolumns}
        data={data?.products}
      />
    </div>
  )
}

export default Report1
