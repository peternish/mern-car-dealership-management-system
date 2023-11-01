import React, { useState, useEffect, useContext } from "react";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import AuthContext from "../AuthContext";
import UpdatePurchaseDetail from "../components/UpdatePurchaseDetail";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [purchase, setAllPurchaseData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
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
  
    // Handle Search Term
    // const handleSearchTerm = (e) => {
    //   setSearchTerm(e.target.value);
    //   console.log(e.target.value);
    //   if (searchTerm === '') {
    //     fetchPurchaseData();
    //   } else {
    //     fetchSearchData();
    //   }
    // };

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

  // Modal for Pruchase Add
  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };
  
  // Modal for Pruchase Add
  const updateProductModalSetting = (element) => {
    setShowUpdateModal(!showUpdateModal);
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
        
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Purchase</span>
              {/* <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  id="searchbar"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div> */}
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
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  VIN
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Make
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Model
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Year
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Condition
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Initial Exp
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Additional Exp
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Approval State
                </th>
              </tr>
            </thead>

            <tbody id="myTb" className="divide-y divide-gray-200">
              {purchase.map((element, index) => {
                return (
                  <tr key={element._id} className={element.state === 'on sale' ? 'bg-green-100' : 'bg-white'}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.vin}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.manufacturer}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.model}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.year}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(element.purchaseDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : new Date(element.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.condition}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.initial}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.additional}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.initial + element.additional}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.state}
                    </td>        
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                          className="text-green-700 cursor-pointer"
                          onClick={() => updateProductModalSetting(element)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </span>
                    </td>
                    <td>
                      <span
                        className="text-red-600 px-2 cursor-pointer"
                        onClick={() => deleteItem(element._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </span>
                    </td>
                    <td>
                        <button
                          className="text-blue-600 px-2 cursor-pointer hover:bg-slate-300 font-bold p-2 rounded"
                          onClick={() => approveItem(element._id)}
                        >
                          {element.state}
                        </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PurchaseDetails;
