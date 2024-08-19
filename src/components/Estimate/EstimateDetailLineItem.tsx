import React from "react";
import EstimateLineItems from "./EstimatePdfContent/EstimateLineItems";
import EstimatePdfContent from "./EstimatePdfContent/EstimatePdfContent";
import EstimatePdfFooter from "./EstimatePdfFooter/EstimatePdfFooter";
import EstimatePdfHeader from "./EstimatePdfHeader/EstimatePdfHeader";

const EstimateDetailLineItem = (props: any) => {
  return (
    <div>
      <EstimatePdfHeader />
      <EstimateLineItems estimateData={props.estimateData} />
      <EstimatePdfFooter />
    </div>
  );
};

export default EstimateDetailLineItem;
