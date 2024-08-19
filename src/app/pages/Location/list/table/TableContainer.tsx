import React from "react";
import { 
  useTable,
	useSortBy,
	usePagination,
	useGlobalFilter,
	useFilters,
 } from "react-table";
 import { Row } from "react-bootstrap";

import { ReactSearchAutocomplete } from "react-search-autocomplete";

const TableContainer = (props: any) => {
  const { columns, data,sortBy } = props;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setGlobalFilter,
  }: any = useTable(
    {
      columns,
      data,
      initialState: { sortBy },
    },
    useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination
  );

  const onChangeInSelect = (event: any) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event: any) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  console.log({ data });

  //   const My = [
  //     {
  //       id: 1,
  //       name: "Faisal",
  //     },
  //     {
  //       id: 2,
  //       name: "Faiq",
  //     },
  //     {
  //       id: 3,
  //       name: "Khalid",
  //     },
  //   ];

  const My = [
    {
      id: 1,
      name: "OC1",
    },

    {
      id: 2,
      name: "OC2",
    },
    {
      id: 3,
      name: "OC3",
    },
    {
      id: 4,
      name: "OC4",
    },
    {
      id: 5,
      name: "OC5",
    },
    {
      id: 6,
      name: "OC6",
    },
    {
      id: 7,
      name: "OC7",
    },
    {
      id: 8,
      name: "OC8",
    },
    {
      id: 9,
      name: "ASU Macro Technology Works Building",
    },
  ];

  const handleFilterChange = (e) => {
		const { value } = e.currentTarget;
		setGlobalFilter(value);
	};


  return (
    <>
    <Row>
			<div className="fv-row mb-7 col-6">
			<input
				type="text"
				placeholder="Search"
				name="search"
				className={"form-control form-control-solid mb-3 mb-lg-0"}
				onChange={handleFilterChange}
			/>
			</div>
      <props.extraFilters />
		</Row>
    
      {/* <div style={{ width: 600 }}>
        <ReactSearchAutocomplete
          //   items={data.length ? data : []}
          items={My}
          // onSearch={handleOnSearch}
          // onHover={handleOnHover}
          // onSelect={handleOnSelect}
          // onFocus={handleOnFocus}
          autoFocus
          formatResult={formatResult}
        />
      </div> */}
      {/* <Row>
        <div className="fv-row mb-7 col-8" style={{ width: "100%" }}>
          <label className="fw-bold fs-6 mb-2  d-flex justify-content-start">
            Search
          </label>
          <div style={{ height: "40px" }}>
            <ReactSearchAutocomplete
              items={data}
              styling={{
                height: "100%",
                color: "red",
              }}
              // onSearch={handleOnSearch}
              // onHover={handleOnHover}
              // onSelect={handleOnSelect}
              // onFocus={handleOnFocus}
              autoFocus
              formatResult={formatResult}
            />
          </div>
        </div>
      </Row> */}
      {/* <Row style={{ width: "100%", height: "60px" }}>
        <div>
          <ReactSearchAutocomplete
            styling={{
              height: "100%",
            }}
            items={data}
            // onSearch={handleOnSearch}
            // onHover={handleOnHover}
            // onSelect={handleOnSelect}
            // onFocus={handleOnFocus}
            autoFocus
            formatResult={formatResult}
          />
        </div>
      </Row> */}
      <div className="table-responsive">
      <table
        className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr
              className="pd-2 text-start text-muted fw-bolder fs-7 text-uppercase gs-0 bg-light"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column: any, index: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={index == 0 ? "ps-4 min-w-300px rounded-start" : index == headerGroup.headers.length - 1 ? "min-w-200px rounded-end" : ""}
                >
                  {column.render("Header")}
                  {generateSortingIndicator(column)}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td className={'text-dark fw-semibold'} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        className="d-flex align-items-center justify-content-center mt-10"
        style={{ marginTop: "35px" }}
      >
        <div className="pagination d-flex align-items-center">
          <button
            className={
              canPreviousPage
                ? "btn btn-sm btn-primary me-5"
                : "btn btn-sm btn-light btn-active-light-primary me-5"
            }
            data-kt-menu-dismiss="true"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Previous
          </button>
          <div className="d-flex align-items-center me-5">
            <label className="d-flex align-items-center fs-5 fw-semibold me-3">
              <span>
                Page {pageIndex + 1} of {pageOptions.length}
              </span>
            </label>
            <input
              className="form-control form-control-lg form-control-solid"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </div>
          <select
            className="form-select form-select-solid me-5"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            style={{ width: "150px" }}
          >
            {[2, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <button
            className={
              canNextPage
                ? "btn btn-sm btn-primary"
                : "btn btn-sm btn-light btn-active-light-primary me-2"
            }
            data-kt-menu-dismiss="true"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Next
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

const generateSortingIndicator = (column: any) => {
  return column.isSorted ? (
    column.isSortedDesc ? (
      <i
        className="bi bi-chevron-down fw-bold gy-5"
        style={{ marginLeft: "5px" }}
      ></i>
    ) : (
      <i
        className="bi bi-chevron-up fw-bold gy-5"
        style={{ marginLeft: "5px" }}
      ></i>
    )
  ) : (
    ""
  );
};

export default TableContainer;
