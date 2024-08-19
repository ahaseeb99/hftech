import React from "react";
import ContactForm from "./EditContactForm";

const ContactUpdate: React.FC = () => {
  return (
    <div className="row gy-5 g-xl-8">
      <div className="col-xxl-6">
        <div className="card card-xl-stretch mb-xl-8">
          <div className="card-body pt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUpdate;
