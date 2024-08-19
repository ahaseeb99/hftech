import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface IPoModal {
    poNumber: string;
    handleClose: () => void;
}

const POModal = ({ poNumber, handleClose }: IPoModal) => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        document.body.classList.add("modal-open");
        return () => {
            document.body.classList.remove("modal-open");
        };
    }, []);

    return (
        <>
            <div
                className="modal fade show d-block"
                id="kt_modal_add_user"
                role="dialog"
                tabIndex={-1}
                aria-modal="true"
            >
                <div
                    className="modal-dialog modal-dialog-centered modal-md"
                    style={{ width: "950px !important" }}
                >
                    <div className="modal-content">
                        <div
                            className="modal-body scroll-y mx-5 mx-xl-15 my-7"
                            style={{ textAlign: "center" }}
                        >
                            <div className="contactHeader" style={{ textAlign: "center" }}>
                                <h2>Purchase Order</h2>
                            </div>
                            {poNumber && (
                                <div
                                    className="fv-row mb-7 "
                                    style={{
                                        marginTop: "30px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <label className="fw-bold fs-6 mb-2 mt-6 w-100  text-center">
                                        {poNumber}
                                    </label>
                                    <CopyToClipboard
                                        onCopy={() => setIsCopied(true)}
                                        text={poNumber}
                                    >
                                        <FontAwesomeIcon
                                            title="copy to clipboard"
                                            icon={faCopy}
                                            style={{
                                                color: isCopied ? "red" : "",
                                                cursor: "pointer",
                                                fontSize: "18px",
                                            }}
                                        />
                                    </CopyToClipboard>
                                </div>
                            )}
                            <div
                                style={{
                                    marginTop: "15px",
                                }}
                            >
                                <div className="d flex">
                                    <Row style={{ display: "flex", justifyContent: "center" }}>
                                        <Col xs={6} md={6} lg={6}>
                                            <div className="text-end pt-5">
                                                <button
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    type="submit"
                                                    className="btn btn-secondary"
                                                    onClick={() => handleClose()}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default POModal;
