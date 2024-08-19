import React from "react"
import { useTable, useSortBy, usePagination } from "react-table"
import clsx from "clsx"

const TableContainer = (props: any) => {
	const { columns, data } = props
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
	}: any = useTable(
		{
			columns,
			data,
		},
		useSortBy,
		usePagination
	)

	const onChangeInSelect = (event: any) => {
		setPageSize(Number(event.target.value))
	}

	const onChangeInInput = (event: any) => {
		const page = event.target.value ? Number(event.target.value) - 1 : 0
		gotoPage(page)
	}

	return (
		<>
			<table
				className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
				{...getTableProps()}
			>
				<thead>
					{headerGroups.map((headerGroup: any) => (
						<tr
							className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0"
							{...headerGroup.getHeaderGroupProps()}
						>
							{headerGroup.headers.map((column: any) => (
								<th {...column.getHeaderProps(column.getSortByToggleProps())}>
									{column.render("Header")}
									{generateSortingIndicator(column)}
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
					{page.map((row: any) => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell: any) => {
									return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
								})}
							</tr>
						)
					})}
				</tbody>
			</table>

			<div
				className="d-flex align-items-center justify-content-end m-5"
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
								const page = e.target.value ? Number(e.target.value) - 1 : 0
								gotoPage(page)
							}}
							style={{ width: "100px" }}
						/>
					</div>
					<select
						className="form-select form-select-solid me-5"
						value={pageSize}
						onChange={(e) => {
							setPageSize(Number(e.target.value))
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
		</>
	)
}

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
	)
}

export default TableContainer
