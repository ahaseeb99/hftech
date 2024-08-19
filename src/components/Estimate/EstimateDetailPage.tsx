import React from "react";
import EstimatePdfContent from "./EstimatePdfContent/EstimatePdfContent";
import EstimatePdfFooter from "./EstimatePdfFooter/EstimatePdfFooter";
import EstimatePdfHeader from "./EstimatePdfHeader/EstimatePdfHeader";

const EstimateDetailPage = (props: any) => {
  return (
    <div id="divToPrint">
      <EstimatePdfHeader />
      <EstimatePdfContent estimateData={props.estimateData} />
      <EstimatePdfFooter />
    </div>
  );
};

export default EstimateDetailPage;
