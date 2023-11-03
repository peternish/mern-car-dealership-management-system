import React, { useState, useEffect, useContext } from "react";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import AuthContext from "../AuthContext";
import UpdatePurchaseDetail from "../components/UpdatePurchaseDetail";
import SearchByVIN from "../components/SearchByVIN";
import UpdateExpense from "../components/UpdateExpense";

import { Popover, PopoverContent, PopoverHandler, } from "@material-tailwind/react";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [purchase, setAllPurchaseData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [showUpdateExpenseModal, setUpdateExpenseModal] = useState(false);
  const [updatePage, setUpdatePage] = useState(true);
  
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchPurchaseData();
  }, [updatePage]);

  // Fetching Data of All Purchase items
  const fetchPurchaseData = () => {
    fetch('http://localhost:4000/api/purchase/get',
      {method: 'POST'})
      .then((response) => response.json())
      .then((data) => {
        setAllPurchaseData(data);
      })
      .catch((err) => console.log(err));
  };

  // Delete item
  const deleteItem = (id) => {
    fetch(`http://localhost:4000/api/product/delete/${id}`, {
      method: 'POST'
    })
      .then((response) => response.json())
      .then((response) => {
        setUpdatePage(!updatePage);
      });
  };

  // approve the Item for sale
  const approveItem = (id) => {
    fetch(`http://localhost:4000/api/product/approve/${id}`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.status === 200) {
        setUpdatePage(!updatePage);
      } else {
        alert('Sorry. Please retry.')
      }
    })
  }

  // approve additional expense
  const approveExpense = (id) => {
    fetch(`http://localhost:4000/api/product/approveexpense/${id}`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.status === 200) {
        setUpdatePage(!updatePage);
      } else {
        alert('Sorry. Please retry.')
      }
    })
  }

  // Modal for Purchase Add
  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };
  
  // Modal for Purchase Update
  const updateProductModalSetting = (element) => {
    setShowUpdateModal(!showUpdateModal);
    setUpdateProduct(element);
  };

  // Modal for Expense Add
  const updateExpenseModalSetting = (element) => {
    setUpdateExpenseModal(!showUpdateExpenseModal);
    setUpdateProduct(element);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">

        {showPurchaseModal && (
          <AddPurchaseDetails
            addSaleModalSetting={addSaleModalSetting}
            handlePageUpdate={handlePageUpdate}
            authContext = {authContext}
          />
        )}

        {showUpdateModal && (
          <UpdatePurchaseDetail 
            updateModalSetting={updateProductModalSetting}
            handlePageUpdate={handlePageUpdate}
            updatePurchaseData={updateProduct}
          />
        )}
        
        {showUpdateExpenseModal && (
          <UpdateExpense 
            updateExpenseModalSetting={updateExpenseModalSetting}
            handlePageUpdate={handlePageUpdate}
            updatePurchaseData={updateProduct}
          />
        )}

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Purchase</span>
              <SearchByVIN />
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}
              >
                Add Purchase
              </button>
            </div>
          </div>
          {
            JSON.parse(localStorage.getItem('user')).email === 'peter95613@gmail.com'
            ?
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    VIN
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Make
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Model
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Year
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Condition
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Initial Exp/$
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Add Exp/$
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Total/$
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Approval State
                  </th>
                </tr>
              </thead>

              <tbody id="myTb" className="divide-y divide-gray-200">
                {purchase.map((element, index) => {
                  return (
                    <tr key={element._id} className={element.state === 'on sale' ? 'bg-green-100' : element.state === 'sold' ? 'bg-slate-200' : 'bg-white'}>
                      <td className="whitespace-nowrap px-2  text-gray-900">
                        {element.vin}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.manufacturer}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.model}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.year}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {new Date(element.purchaseDate).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                          ? "Today"
                          : new Date(element.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.condition}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.initial}
                      </td>
                      <Popover>
                        <PopoverHandler>
                          <td className="whitespace-nowrap px-2 text-gray-700 cursor-pointer hover:bg-slate-100">
                            <span>{element.additional.reduce((sum, a) => sum + parseInt(a.amount), 0)}</span>
                          </td>
                        </PopoverHandler>
                        <PopoverContent>
                          {element.additional.map((item, i) => {
                            return (
                              <div key={i} className="grid grid-cols-6 gap-3">
                                <div className="grid col-span-1">
                                  {item.date}:
                                </div>
                                <div className="grid col-span-1">
                                  ${item.amount}
                                </div>
                                <div className="grid col-span-3">
                                  '{item.reason}'
                                </div>
                                <div className="grid col-span-1">
                                  {item.state}
                                </div>
                              </div>
                            )
                          })}
                        </PopoverContent>
                      </Popover>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        <span>{element.initial + element.additional.reduce((sum, a) => sum + parseInt(a.amount), 0)}</span>
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.additional.length ? element.additional[element.additional.length - 1].state : ''}
                      </td>
                      <td>
                        {element.state}
                      </td>
                      {
                        element.state === 'sold'
                        ?
                        <>
                        <td className="px-2 py-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                          </svg>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </>
                        :
                        <>
                          <td className="whitespace-nowrap px-2 text-gray-700">
                            <span
                              className="text-green-700 cursor-pointer"
                              onClick={() => updateProductModalSetting(element)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </span>
                          </td>           
                          <td className="whitespace-nowrap px-2 text-gray-700">
                            <span
                                className="text-green-700 cursor-pointer"
                                onClick={() => updateExpenseModalSetting(element)}
                              >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              </span>
                          </td>
                        <td className="whitespace-nowrap px-2 text-gray-700">
                          <span
                              className="text-green-700 cursor-pointer"
                              onClick={() => approveExpense(element._id)}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                        </td>
                        <td style={{minWidth:'100px'}}>
                            <button
                              className="text-blue-600 px-2 cursor-pointer hover:bg-slate-300 font-bold p-2 rounded"
                              onClick={() => approveItem(element._id)}
                            >
                              {element.state}
                            </button>
                        </td>
                        <td>
                          <span
                            className="text-red-600 px-4 cursor-pointer"
                            onClick={() => deleteItem(element._id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </span>
                        </td>
                      </>
                      }        
                    </tr>
                  );
                })}
              </tbody>
            </table>
            :
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    VIN
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Make
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Model
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Year
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Condition
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Add Exp/$
                  </th>
                  <th className="whitespace-nowrap px-2 py-2 text-left font-medium text-gray-900">
                    Approval State
                  </th>
                </tr>
              </thead>

              <tbody id="myTb" className="divide-y divide-gray-200">
                {purchase.map((element, index) => {
                  return (
                    <tr key={element._id} className={element.state === 'on sale' ? 'bg-green-100' : element.state === 'sold' ? 'bg-slate-200' : 'bg-white'}>
                      <td className="whitespace-nowrap px-2  text-gray-900">
                        {element.vin}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.manufacturer}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.model}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.year}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {new Date(element.purchaseDate).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                          ? "Today"
                          : new Date(element.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.condition}
                      </td>
                      <Popover>
                        <PopoverHandler>
                          <td className="whitespace-nowrap px-2 text-gray-700 cursor-pointer hover:bg-slate-100">
                            <span>{element.additional.reduce((sum, a) => sum + parseInt(a.amount), 0)}</span>
                          </td>
                        </PopoverHandler>
                        <PopoverContent>
                          {element.additional.map((item, i) => {
                            return (
                              <div key={i} className="grid grid-cols-6 gap-3">
                                <div className="grid col-span-1">
                                  {item.date}:
                                </div>
                                <div className="grid col-span-1">
                                  ${item.amount}
                                </div>
                                <div className="grid col-span-3">
                                  '{item.reason}'
                                </div>
                                <div className="grid col-span-1">
                                  {item.state}
                                </div>
                              </div>
                            )
                          })}
                        </PopoverContent>
                      </Popover>
                      <td className="whitespace-nowrap px-2 text-gray-700">
                        {element.additional.length ? element.additional[element.additional.length - 1].state : ''}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-gray-700">
                        <span>
                          {element.state}
                        </span>
                      </td>
                      {
                        element.state === 'sold'
                        ?
                        <>
                        <td className="px-2 py-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                          </svg>
                        </td>
                        </>
                        :
                        <td className="whitespace-nowrap px-2 py-2 text-gray-700">
                          <span
                              className="text-green-700 cursor-pointer"
                              onClick={() => updateExpenseModalSetting(element)}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </span>
                        </td>
                      }
                    </tr>
                  );
                })}
              </tbody>
            </table>
            }

        </div>
      </div>
    </div>
  );
}

export default PurchaseDetails;
