import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getRoles } from "../../../../store/roles/actions";

type Props = {
    show: boolean;
    handleClose: () => void;
    handleSubmit: any
    checkBoxData: string[]
    setCheckBoxData: any
};

const UserFilterModal: React.FC<Props> = ({
    show,
    handleClose,
    handleSubmit,
    checkBoxData,
    setCheckBoxData
}) => {
    const dispatch: any = useDispatch()
    const { rolesData } = useSelector((state: any) => state.roles);
    useEffect(() => {
        const getRolesList = async () => {
            await dispatch(ACTION_getRoles());
        };
        getRolesList();
    }, []);

    const handleCheckBoxCheck = (e, id) => {
        if (e.target.checked) {
            setCheckBoxData([...checkBoxData, id])
        }
        else {
            const filterCheckBoxData: string[] = checkBoxData.filter(item => item != id);
            setCheckBoxData([...filterCheckBoxData])
        }
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (checkBoxData.length < 0) return
        handleSubmit(checkBoxData)
    }
    useEffect(() => {
        if(rolesData?.length > 0){
             const filterData : string[] = rolesData.filter(item => item.name != "DEVELOPER").map(item => item._id)
             setCheckBoxData([...checkBoxData,...filterData])
        }
    },[rolesData])
    return (
        <Modal
            className="modal fade show d-block"
            id="kt_header_search_modal"
            aria-hidden="true"
            dialogClassName="modal-dialog modal-dialog-centered modal-md"
            show={show}
        >
            <div className="modal-content shadow-none">
                <form className="p-8 m-4" onSubmit={handleFormSubmit}>
                    <h5 className="required fs-4">Roles</h5>
                    {rolesData.map((item, index) => (
                        <div key={`role ${index}`} className="py-2">
                            <input defaultChecked={checkBoxData.length > 0 ? checkBoxData?.includes(item?._id) : item.name !== "DEVELOPER"} className="form-check-input me-5" type={"checkbox"} id
                                ={`${item.name}${index}`} defaultValue={item._id} onChange={e => handleCheckBoxCheck(e, item?._id)} />
                            <label htmlFor={`${item.name}${index}`} className="form-check-label cursor-pointer" >{item.name}</label>
                        </div>
                    ))}
                    <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                        <button className="btn btn-primary w-100" type="submit">Submit</button>
                        <button className="btn btn-secondary w-100" type="button" onClick={() => handleClose()}>
                            cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default UserFilterModal;
