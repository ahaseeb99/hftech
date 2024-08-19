import React from "react";
import FlagCreateForm from "./FlagCreateForm";

const FlagCreate: React.FC = () => {
  return (
    <div className="row gy-5 g-xl-8">
      <div className="col-xxl-6">
        <div className="card card-xl-stretch mb-xl-8">
          <div className="card-body pt-5">
              <FlagCreateForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagCreate;
