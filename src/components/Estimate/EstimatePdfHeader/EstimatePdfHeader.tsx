import React from "react";
import Logo from "../../../assets/images/pdfHeaderLogo.png";
import Logo2 from "../../../assets/images/pdfHeaderLogo2.png";

const EstimatePdfHeader = () => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <p>
        <img src={Logo} alt="logo" height={130} />
      </p>
      <p style={{ marginLeft: "auto" }}>
        <img src={Logo2} alt="logo" height={130} />
      </p>
    </div>
  );
};

export default EstimatePdfHeader;
