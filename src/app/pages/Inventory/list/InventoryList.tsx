import _ from "lodash"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
// import { ACTION_getInventoryList } from "../../../../store/inventory/actions"
// import DeleteInventoryModal from "../delete/DeleteInventoryModal"
// import DeleteInventoryModal from "../delete/DeleteInventoryModal"
import InventoryTable from "./table/InventoryTable"

export const InventoryList: React.FC = () => {
	const dispatch: any = useDispatch()
	// const { inventoryData } = useSelector((state: any) => state.inventory)
	const [inventoryList, setInventoryList] = useState([])

	const [showDeleteModal, setShowDeleteModal] = useState<any>(false)
	const [activeInventory, setActiveInventory] = useState<any>(null)

	const showDeleteModalHandler = (_inventory: any) => {
		console.log("checking _inventory: ", _inventory)
		setActiveInventory(_inventory)
		setShowDeleteModal(true)
	}

	function createData(
		id: any,
		fullName: any,
		location: any,
		tags: any,
		company: any,
		date: any
	) {
		return {
			id,
			fullName,
			location,
			tags,
			company,
			date,
		}
	}

	const rows = [
		createData(
			1,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			2,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			3,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			4,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			5,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			6,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			7,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			8,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			9,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			10,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			11,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
		createData(
			12,
			"James",
			"United State",
			"grum",
			"HF Tech",
			moment().format("DD/MM/YYYY")
		),
	]

	const closeDeleteModalHandler = () => {
		setActiveInventory(null)
		setShowDeleteModal(false)
	}

	useEffect(() => {
		// dispatch(ACTION_getInventoryList())
	}, [])

	// useEffect(() => {
	// 	setInventoryList(_.get(inventoryData, "inventory", []))
	// }, [inventoryData?.inventory])

	return (
		<div>
			{/* {showDeleteModal && (
				<DeleteInventoryModal
					closeDeleteModalHandler={closeDeleteModalHandler}
					inventoryData={activeInventory}
				/>
			)} */}
			<InventoryTable
				inventoryData={rows}
				showDeleteModalHandler={showDeleteModalHandler}
			/>
		</div>
	)
}
