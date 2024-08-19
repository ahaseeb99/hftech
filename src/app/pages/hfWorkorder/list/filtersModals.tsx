/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import {
    PriorityDropdownData
} from "../create/WorkOrderForm";
import _get from "lodash/get";
import { useSelector } from "react-redux";
import CustomDropdownValue from "../../../../components/CustomDropDrownValue/CustomDropDrownValue";

type Props = {
    show?: boolean;
    filterContactList: any;
    activeUserList: any;
    filterReqPacket : any
    handleClose?: () => void;
    setFilterReqPacket: any
    handleFilterSubmit: any
    flagDropdownData : any
    statusDropdownData: any
    clientsData: any
};

const FiltersModal: React.FC<Props> = ({
    show,
    filterContactList,
    activeUserList,
    handleClose,
    setFilterReqPacket,
    filterReqPacket,
    handleFilterSubmit,
    flagDropdownData,
    statusDropdownData,
    clientsData
}) => {
  
  const handeFilterValueChange = (target, value) => {
    setFilterReqPacket({...filterReqPacket, [target]: value})
  }
    const handleInputChange = (e) => {
      if(filterReqPacket.missingScheduledTo){
        setFilterReqPacket({...filterReqPacket,['missingScheduledTo'] : false , ['scheduledTo'] : e.target.value })
        return
      }
      setFilterReqPacket({...filterReqPacket,['scheduledTo'] : e.target.value })
    }

    const handleCheckBoxChange = (e) => {
      if(e.target.checked){
        setFilterReqPacket({...filterReqPacket,['missingScheduledTo'] : e.target.checked , ['scheduledTo'] : ''})
      }
      else{
        handeFilterValueChange('missingScheduledTo',e.target.checked)
      }
    }
    return (
        <Modal
            className="modal fade show d-block"
            id="kt_header_search_modal"
            aria-hidden="true"
            dialogClassName="modal-dialog modal-dialog-centered modal-md"
            show={show}
        >
            <div className="modal-content shadow-none">
                <form onSubmit={handleFilterSubmit}>
                    <div className="modal-body scroll-y mx-5 my-7">
                        <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                                Priority
                            </label>
                            <div>
                                <CustomDropdown
                                    name="priority"
                                    value={
                                        filterReqPacket.priority && ({
                                            label: filterReqPacket.priority,
                                            value: filterReqPacket.priority
                                        })
                                    }
                                    placeholder="Select a Priority..."
                                    options={PriorityDropdownData?.map(
                                        (item) => {                                      
                                            return {
                                                label: item?.label,
                                                value: item?.Id,
                                            };
                                        }
                                    )}
                                    onChange={(e) => handeFilterValueChange('priority',e.label)}
                                />
                            </div>
                        </div>
                        <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                                Bill To
                            </label>
                            <div>
                        <CustomDropdownValue
                            name="client"
                            value={
                                filterReqPacket.billTo && ({
                                    label: _get(clientsData, "clients", [])?.find(item => item?._id ==  filterReqPacket.billTo)?.DisplayAs,
                                    value: _get(clientsData, "clients", [])?.find(item => item?._id ==  filterReqPacket.billTo)?._id
                                })
                            }
                            options={_get(clientsData, "clients", []).map((item) => {
                                return {
                                    label: item?.DisplayAs,
                                    value: item?._id,
                                };
                            })}
                            onChange={(e) => handeFilterValueChange('billTo',e.value)}
                        />
                        </div>
                        </div>
                        <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                                Status
                            </label>
                            <div>
                                <CustomDropdown
                                    name="Status"
                                    value={
                                        filterReqPacket.status && ({
                                            label: filterReqPacket.status,
                                            value: filterReqPacket.status
                                        })
                                    }
                                    placeholder="Select a Status..."
                                    options={statusDropdownData?.map(
                                        (item) => {                                      
                                            return {
                                                label: item?.label,
                                                value: item?.value,
                                            };
                                        }
                                    )}
                                    onChange={(e) => handeFilterValueChange('status',e.value)}
                                />
                            </div>
                        </div>
                        <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                                Assigned To
                            </label>
                            <div>
                                <CustomDropdown
                                    name="assigned"
                                    value={
                                        filterReqPacket.assigned && ({
                                            label: filterReqPacket.assigned,
                                            value: filterReqPacket.assigned
                                        })
                                    }
                                    placeholder="Select a Assigned To..."
                                    options={activeUserList?.map(
                                        (item) => {
                                            return {
                                                label: item?.DisplayAs ? item.DisplayAs : item.FirstName,
                                                value: item?._id,
                                            };
                                        }
                                    )}
                                    onChange={(e) => handeFilterValueChange('assigned', e.label)}
                                />
                            </div>
                        </div>
                        <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                                Flag
                            </label>
                            <div>
                                <CustomDropdown
                                    name="flag"
                                    value={
                                        filterReqPacket.flag && ({
                                            label: filterReqPacket.flag,
                                            value: filterReqPacket.flag
                                        })
                                    }
                                    placeholder="Select a Flag..."
                                    options={flagDropdownData?.map((item: any) => {
                                            return {
                                                data: item,
                                                label: item?.DisplayAs,
                                                value: item?._id,
                                            };
                                        }
                                    )}
                                    onChange={(e) => handeFilterValueChange('flag', e.label)}
                                />
                            </div>
                        </div>
                        <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                                Contact
                            </label>
                            <div>
                                <CustomDropdown
                                    name="contact"
                                    value={
                                        filterReqPacket.contact && ({
                                            label: filterContactList?.find(contact => contact._id == filterReqPacket.contact)?.fullName,
                                            value: filterContactList?.find(contact => contact._id == filterReqPacket.contact)?.fullName
                                        })
                                    }
                                    placeholder="Select a Contact..."
                                    options={filterContactList?.map(
                                        (item) => {
                                            return {
                                                label: item?.fullName,
                                                value: item?._id,
                                            };
                                        }
                                    )}
                                    onChange={(e) => handeFilterValueChange('contact', e.value)}
                                />
                            </div>
                        </div>
                        <div className="fv-row mb-7">
                            <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                            Scheduled To
                            </label>
                            <div>
                                 <input 
                                   type={"date"}
                                    value={filterReqPacket.scheduledTo}
                                    onChange={(e) => handleInputChange(e)}
                                    className={"form-control form-control-solid mb-3 mb-lg-0"}
                                />
                            </div>
                        </div>
                        <div className="fv-row mb-10">
                            <div className="form-check form-check-custom form-check-solid cursor-pointer">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="poOnly"
                                checked={filterReqPacket.poNumber}
                                onChange={e => handeFilterValueChange('poNumber', e.target.checked)}
                            />
                            <label
                                className="form-check-label fw-bold cursor-pointer text-gray-700 fs-6"
                                htmlFor="poOnly"
                            >
                                Missing PO only
                            </label>
                            </div>
                        </div>
                        <div className="fv-row mb-10">
                            <div className="form-check form-check-custom form-check-solid cursor-pointer">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="scheduledCheckBox"
                                checked={filterReqPacket.missingScheduledTo}
                                onChange={e => handleCheckBoxChange(e)}
                            />
                            <label
                                className="form-check-label fw-bold cursor-pointer text-gray-700 fs-6"
                                htmlFor="scheduledCheckBox"
                            >
                                Missing Scheduled To
                            </label>
                            </div>
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <div className="d flex">
                                <Row>
                                    <Col>
                                        <div className="text-end pt-5">
                                            <button
                                                className="btn btn-primary"
                                                style={{
                                                    width: "100%",
                                                }}
                                                type="submit"
                                                // onClick={handleSubmit}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Col>
                                    <Col xs={6} md={6} lg={6}>
                                        <div className="text-end pt-5">
                                            <button
                                                type="button"
                                                style={{
                                                    width: "100%",
                                                }}
                                                onClick={handleClose}
                                                className="btn btn-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default FiltersModal;
