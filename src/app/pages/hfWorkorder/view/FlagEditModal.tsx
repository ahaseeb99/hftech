import { useEffect, useState } from "react";
import { Modal, Row } from "react-bootstrap";
import CustomDropdownValue from "../../../../components/CustomDropDrownValue/CustomDropDrownValue";

const EditFlagModal = ({
  flags,
  show,
  handleClose,
  handleEditFlag,
  existFlag,
  currentFlag,
}: any) => {
  const [flag, setFlag] = useState<any>({});
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!flag.DisplayAs || flag?._id == currentFlag?._id) {
      handleClose();
      return;
    }
    handleEditFlag(flag)
  };

  useEffect(() => {
    setFlag(currentFlag);
  }, [currentFlag]);

  const flagExist = existFlag.map((item) => item?._id);
  return (
    <Modal
      className="modal fade show d-block"
      id="kt_header_search_modal"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered modal-md"
      show={show}
    >
      <div className="modal-content shadow-none">
        <form className="p-10" onSubmit={handleSubmit}>
          <Row>
            <label>Flags</label>
            <div className="my-4">
              <CustomDropdownValue
                value={{ label: flag?.DisplayAs }}
                options={flags.reduce((acc, cur) => {
                  if (!flagExist.includes(cur?._id)) {
                    acc.push({
                      value: cur,
                      label: cur?.DisplayAs,
                    });
                  }
                  return acc;
                }, [])}
                onChange={(e) => setFlag(e.value)}
                placeholder="select..."
              />
            </div>
          </Row>
          <Row>
            <div className="text-end">
              <button
                onClick={() => handleClose()}
                className="btn btn-light me-3"
                type="button"
              >
                Discard
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </Row>
        </form>
      </div>
    </Modal>
  );
};

export default EditFlagModal;
