import axios from "axios";
import _ from "lodash";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ACTION_getAllHFWorkOrders,
  ACTION_getHFWorkOrders,
  ACTION_getWorkOrdersFlags,
  ACTION_getWorkOrderStatus
} from "../../../../store/workorder/actions";
import { ACTION_getContacts } from "../../../../store/contact/actions";
import WorkOrderTable from "./table/WorkOrderTable";
import FiltersModal  from './filtersModals'
import { ACTION_getClients } from "../../../../store/client/actions";
import _get from "lodash/get";
import { ACTION_getUsers } from "../../../../store/users/actions";
import ToggleSwitch from "../../../../components/ToggleSwitch/toggle";
import { ACTION_clearEstimate } from "../../../../store/estimate/actions";

export const WorkOrderList: React.FC = () => {

  const [filteredWorkOrderList, setFilteredWorkOrderList] = useState<any>([])
  const [filterContactList, setFilterContactList ] = useState<any>([])
  const [clientFilterBy, setClientFilterBy] = useState<any>('')
  const [loading, setLoading] = useState(false)
  const { clientsData } = useSelector((state: any) => state.client);
  const dispatch: any = useDispatch();
  const allWorkordersList = useSelector(
    (state: any) => state.workOrder.allHFWorkordersList
  );
  const isloading : any = useSelector(
    (state: any) => state.workOrder.loading
  );


  const metaData = useSelector(
    (state: any) => state.workOrder.workOrderPaginationMetadata
  );
  const user = useSelector((state: any) => state.auth.user)
  const contactList = useSelector(
    (state: any) => state.contacts.contactsData.contacts
  );

  useEffect(() => {
    setFilterContactList(contactList)
  }, [contactList]);

  useEffect(()=> {
    if(user.role.name === 'TECHNICIAN') {
      const list = allWorkordersList.filter(workOrder => workOrder?.employee?.map(item => item?._id).includes(user?._id) || workOrder?.Tasks?.reduce((acc, cur) => {
        if (cur?.assignedTo?.length > 0) {
          acc.push(cur.assignedTo)
        }
        return [...acc]
      }, []).flat()?.includes(user?._id) || workOrder?.userId?._id === user?._id)
      setFilteredWorkOrderList(list)
      setLoading(false)
    } else {
      setFilteredWorkOrderList(allWorkordersList)
      setLoading(false)
    }
  },[allWorkordersList, user ])

  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [showFilterModal, setShowFilterModal] = useState<any>(false);
  const [activeWorkOrder, setActiveWorkOrder] = useState<any>(null);
  const [pageLimit, setPageLimit] = useState<any>(50);
  const [pageNumber, setPageNumber] = useState<any>(1);
  const [searchQuery, setSearchQuery] = useState<string>('')
  const  [activeSwitch, setActiveSwitch] = useState(true)
  const [filterReqPacket, setFilterReqPacket] = useState<any>({
    query: '',
    status: '',
    priority: '',
    poNumber: false,
    contact: '',
    assigned: '',
    flag: '',
    customer: '',
    isDeleted : !activeSwitch,
    missingScheduledTo : false,
    scheduledTo : '',
    billTo: ''
  })
  const [activeUserList, setActiveUserList] = useState<any>([])
  const usersList = useSelector((state: any) => state.users.usersList);
  const flagDropdownData = useSelector((state : any) => state.workOrder.workOrderFlags)
  const statusDropdownData = useSelector((state : any) => state.workOrder.workOrderStatus)

  useEffect(()=> {
    const activeUsers = usersList?.filter((user)=> user.status === 'ACTIVE')
    setActiveUserList(activeUsers)
  },[usersList])

  const showDeleteModalHandler = (_WorkOrder: any) => {
    setActiveWorkOrder(_WorkOrder);
    setShowDeleteModal(true);
  };

  const handleClearFilterButton = () => {
    if(isloading) return
    let filtersPacket = {
      query: '',
      status: '',
      priority: '',
      poNumber: false,
      contact: '',
      assigned: '',
      flag: '',
      customer: '',
      isDeleted : !activeSwitch,
      missingScheduledTo : false,
      scheduledTo : '',
      billTo: ''
    }
    setSearchQuery('')
    setClientFilterBy('')
    setLoading(true)
    setFilterReqPacket({...filtersPacket})
    localStorage.setItem("woFilterPacket",JSON.stringify({}))
    dispatch(ACTION_getHFWorkOrders(pageLimit, pageNumber, filtersPacket));
  }

  useEffect(() => {
    const localFilterPacket = JSON.parse(localStorage.getItem("woFilterPacket") as string);
    let filtersPacket = {
      query: localFilterPacket?.query || "",
      status: localFilterPacket?.status || "",
      priority: localFilterPacket?.priority || "",
      poNumber: localFilterPacket?.poNumber || false,
      contact: localFilterPacket?.contact || "",
      assigned: localFilterPacket?.assigned || "",
      flag: localFilterPacket?.flag || "",
      customer: localFilterPacket?.customer || "",
      isDeleted: localFilterPacket?.isDeleted || !activeSwitch,
      missingScheduledTo: localFilterPacket?.missingScheduledTo || false,
      scheduledTo: localFilterPacket?.scheduledTo || "",
      billTo: localFilterPacket?.billTo || ""
    }
    console.log(filtersPacket,"filtersPacket")
    setFilterReqPacket({...filtersPacket})
  },[])
   

  useEffect(() => {
    dispatch(ACTION_getUsers());
    dispatch(ACTION_getClients());
    dispatch(ACTION_getContacts());
    dispatch(ACTION_getWorkOrdersFlags())
    dispatch(ACTION_getWorkOrderStatus())
    dispatch(ACTION_clearEstimate());
    setLoading(true)
  }, []);
  
  const handleDataFilter = (e) => {
    if (isloading) return
    const val = e.target.value;
    setLoading(true)
    if(val == "all") {
      dispatch(ACTION_getAllHFWorkOrders());
    }else {
      dispatch(ACTION_getHFWorkOrders(pageLimit, pageNumber, filterReqPacket));
    }
  }
  
  const handlePageLimit = (e) => {
    if (isloading) return
    setPageLimit(parseInt(e));
    setLoading(true)
    dispatch(ACTION_getHFWorkOrders(parseInt(e), pageNumber, filterReqPacket));
  }

  const handlePageNumber = (e) => {
    if (isloading) return
    if(parseInt(e) && parseInt(e) != 0) {
      setPageNumber(parseInt(e));
      setLoading(true)
      dispatch(ACTION_getHFWorkOrders(pageLimit, parseInt(e), filterReqPacket));
    }
  }

  const handleNextPage = (e) => {
    if (isloading) return
    setPageNumber(e)
    setLoading(true)
    dispatch(ACTION_getHFWorkOrders(pageLimit, parseInt(e), filterReqPacket));
  }

  const handlePreviousPage = (e) => {
    if (isloading) return
    setPageNumber(parseInt(e))
    setLoading(true)
    dispatch(ACTION_getHFWorkOrders(pageLimit, parseInt(e), filterReqPacket));
  }
  
  useEffect(() => {
    handleGetWorkOrderForlist()
  },[activeSwitch])

  const handleFilterChange = (e) => {
    if (isloading) return
    setLoading(true)
    setFilterReqPacket({...filterReqPacket, query: e.target.value?.trim()})
    dispatch(ACTION_getHFWorkOrders(pageLimit, pageNumber, {...filterReqPacket, query: e.target.value?.trim()}));
  }

  const handleFilterButton = (e) => {
    setShowFilterModal(true)
  }

  const handleClientFilter = (e) => {
    if(isloading) return
    setLoading(true)
    if (e === null) {
      setFilterReqPacket({...filterReqPacket , customer: ''});
      setFilterContactList(contactList)
      dispatch(ACTION_getHFWorkOrders(pageLimit, pageNumber, {...filterReqPacket , customer: ''}));
    } else { 
      const client = _get(clientsData, "clients", []).find(client => client._id == e.value);
      if (client) {
        setFilterReqPacket({...filterReqPacket , customer: client.Name});
        setFilterContactList(client?.Contacts)
        setClientFilterBy(client.Name)
        dispatch(ACTION_getHFWorkOrders(pageLimit, pageNumber, {...filterReqPacket , customer: client.Name}));
      }
    }
  }
  const handleFilterSubmit = () => {
    if (isloading) return
      setLoading(true)
      dispatch(ACTION_getHFWorkOrders(pageLimit, pageNumber, filterReqPacket));
      const convertFilterPacket = JSON.stringify(filterReqPacket)
      localStorage.setItem("woFilterPacket",convertFilterPacket)
      setShowFilterModal(false)
  }
  
  const extraFilters = () => <ToggleSwitch label="Show Active" activeSwitch={activeSwitch} onChange={
    e => {
      setActiveSwitch(e.target.checked)
    }
  } />



  const handleGetWorkOrderForlist = () => {
    if(isloading) return
    let filtersPacket = {
      query: '',
      status: '',
      priority: '',
      poNumber: false,
      contact: '',
      assigned: '',
      flag: '',
      customer: '',
      isDeleted : !activeSwitch,
      missingScheduledTo : false,
      scheduledTo : ''
    }
    setFilterReqPacket({...filtersPacket})
    setSearchQuery('')
    setClientFilterBy('')
    setLoading(true)
    dispatch(ACTION_getHFWorkOrders(pageLimit, pageNumber, filtersPacket));
  }
  
  const handleGetAllData = () => {
    if(isloading) return
    let filtersPacket = {
      query: '',
      status: '',
      priority: '',
      poNumber: false,
      contact: '',
      assigned: '',
      flag: '',
      customer: '',
      isDeleted : !activeSwitch,
      missingScheduledTo : false,
      scheduledTo : '',
      billTo: ''
    }
    setSearchQuery('')
    setClientFilterBy('')
    setLoading(true)
    setFilterReqPacket(filtersPacket)
    dispatch(ACTION_getHFWorkOrders(pageLimit, pageNumber, filtersPacket,true));
  }

  return (
    <div>
      {
        showFilterModal && (
          <FiltersModal
            show={showFilterModal}
            handleClose={() => setShowFilterModal(false)}
            filterContactList={filterContactList}
            activeUserList={activeUserList}
            filterReqPacket={filterReqPacket}
            setFilterReqPacket={setFilterReqPacket}
            handleFilterSubmit={handleFilterSubmit}
            flagDropdownData={flagDropdownData}
            statusDropdownData={statusDropdownData}
            clientsData={clientsData}
          />
        )
      }
      <WorkOrderTable
        extraFilters={extraFilters}
        WorkOrderData={filteredWorkOrderList}
        showDeleteModalHandler={showDeleteModalHandler}
        handleDataFilter={handleDataFilter}
        user={user}
        handlePageLimit={handlePageLimit}
        handlePageNumber={handlePageNumber}
        metaData={metaData}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        pageNumber={pageNumber}
        handleFilterChange={e => {handleFilterChange(e); setSearchQuery(e.target.value?.trim())}}
        handleFilterButton={handleFilterButton}
        setClientFilterBy={handleClientFilter}
        clientsData={clientsData}
        clientFilterBy={clientFilterBy}
        handleClearFilterButton={handleClearFilterButton}
        loading={loading}
        searchQuery={searchQuery}
        handleGetAllData={handleGetAllData}
      />
    </div>
  );
};
