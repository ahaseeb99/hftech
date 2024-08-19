import React, { useState } from "react";
import WorkOrderForm from "./WorkOrderForm";

const WorkOrderCreate: React.FC = () => {
  const [next, setNext] = useState<any>();


  return (
    <div className="row gy-5 g-xl-8">
      <div className="col-xxl-6">
        <div className="card card-xl-stretch mb-xl-8">
          <div className="card-body pt-5">
              <WorkOrderForm />            
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderCreate;
function dispatch(arg0: (dispatcher: import("redux").Dispatch<any>) => void) {
  throw new Error("Function not implemented.");
}

