import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ACTION_generateEstimatePdf,
  ACTION_getEstimate,
  ACTION_sendEstimatePdf,
} from "../../../../store/estimate/actions";
import EstimateTable from "./table/EstimateTable";
import _ from "lodash";
import PdfViewerModal from "../PdfViewerModal/PdfViewerModal";
import SendMailModal from "../sendEstimateMail/SendMailModal";
import { getOptionsParameter, getWorkOrders } from "../../../../utils/helpers";
import TextSignature from "text-signature";
import { Oval } from "react-loader-spinner";
import { ACTION_clearWorkOrderDetail, ACTION_getAllHFWorkOrders } from "../../../../store/workorder/actions";
import { imageUrlToBase64 } from './../../../../utils/helpers'
import Logo from '../../../../assets/images/ic_logo.svg'

export const EstimationList: React.FC = () => {
  const dispatch: any = useDispatch();
  const { estimateData } = useSelector((state: any) => state.estimate);
  const { user } = useSelector((state: any) => state.auth);
  const workOrderList  = useSelector((state: any) => state.workOrder.allHFWorkordersList);

  const [estimationList, setEstimationList] = useState([]);
  const [showPdf, setShowPdf] = useState(false);
  const [showDownloadPdf, setShowDownloadPdf] = useState(false);
  const [activePdfEstimate, setActivePdfEstimate] = useState<any>(null);
  const [downloadPdfId, setDownloadPdfId] = useState<any>(null);
  const [workOrderListHashed, setWorkOrderListHashed] = useState([]);
  const [logoBase64, setLogoBase64] = useState<any>()
  // const [showDeleteModal, setShowDeleteModal] = useState<any>(false)
  const [activeEstimate, setActiveEstimate] = useState<any>(null);
  const [isLoading,setLoading] = useState(false)

  const [showSendEstimateModal, setShowSendEstimateModal] =
    useState<any>(false);

  useEffect(() => {
    setLoading(true)
    dispatch(ACTION_getEstimate());
    dispatch(ACTION_getAllHFWorkOrders());
    dispatch(ACTION_clearWorkOrderDetail())
  }, []);

  useEffect(() => {
    setEstimationList(_.get(estimateData, "estimations", []));
    if(estimateData?.estimations?.length >= 0){
     setLoading(false)
    }
  }, [estimateData?.estimations]);

  useEffect(() => {
    const _workOrderListHashed = getWorkOrders(workOrderList);
    setWorkOrderListHashed(_workOrderListHashed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workOrderList]);

  const showPdfHandler = (_estimate: any) => {
    setActivePdfEstimate(_estimate);
    setShowPdf(true);
  };

  const closePdfHandler = () => {
    setActivePdfEstimate(null);
    setShowPdf(false);
  };

  // const showDeleteModalHandler = (_estimate: any) => {
  //   console.log("checking _estimate: ", _estimate);
  //   setActiveEstimate(_estimate);
  //   setShowDeleteModal(true)
  // };

  // const closeDeleteModalHandler = () => {
  //   setActiveEstimate(null);
  //   setShowDeleteModal(false)
  // };

  const showDownloadPdfHandler = (_id: any) => {
    setDownloadPdfId(_id);
    setShowDownloadPdf(true);
  };

  const closeDownloadPdfHandler = () => {
    setDownloadPdfId(null);
    setShowDownloadPdf(false);
  };

  const onSendEstimateBtnHandler = (activeEstimate: any, reqPacket: any) => {
    closeSendEstimateModalHandler();
    dispatch(ACTION_sendEstimatePdf(activeEstimate, reqPacket));
  };

  const showSendEstimateModalHandler = async (_estimate: any) => {
    const logo = await imageUrlToBase64(Logo)
    setLogoBase64(logo)
    setShowSendEstimateModal(true);
    setActiveEstimate(_estimate);
  };

  const closeSendEstimateModalHandler = () => {
    setShowSendEstimateModal(false);
  };
  const optionsParameter = getOptionsParameter(user?.firstName, user?.lastName);

  const textSignature = new TextSignature(optionsParameter);
  textSignature.generateImage(optionsParameter);

  console.log({ activeEstimate });
  console.log({ estimationList });

  return (
    <div>
      {showPdf && (
        <PdfViewerModal
          closePdfHandler={closePdfHandler}
          estimateData={activePdfEstimate}
        />
      )}
      {showSendEstimateModal && (
        <SendMailModal
          closeSendEstimateModalHandler={closeSendEstimateModalHandler}
          estimateData={activeEstimate}
          activeLogo={logoBase64}
          onSendEstimateBtnHandler={onSendEstimateBtnHandler}
        />
      )}
        <EstimateTable
          workOrderListHashed={workOrderListHashed}
          estimateData={estimationList}
          showPdfHandler={showPdfHandler}
          user={user}
          isLoading={isLoading}
          showSendEstimateModalHandler={showSendEstimateModalHandler}
          onSendEstimateBtnHandler={onSendEstimateBtnHandler}
        />
    </div>
  )
};
