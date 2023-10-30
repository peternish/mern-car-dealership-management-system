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

  const [searchTerm, setSearchTerm] = useState('');

  const [approvalState, setApprovalState] = useState('Approve')
  
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
        console.log(data);
        setAllPurchaseData(data);
      })
      .catch((err) => console.log(err));
  };

  // Delete item
  const deleteItem = (id) => {
    fetch(`http://localhost:4000/api/product/delete/${id}`)
      .then((response) => response.json())
      .then((response) => {
        setUpdatePage(!updatePage);
      });
  };

    // Fetching Data of Search Products
    const fetchSearchData = () => {
      fetch(`http://localhost:4000/api/product/search?searchTerm=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
          setAllPurchaseData(data);
        })
        .catch((err) => console.log(err));
    };
  
    // Handle Search Term
    const handleSearchTerm = (e) => {
      setSearchTerm(e.target.value);
      if (searchTerm == '') {
        fetchPurchaseData();
      } else {
        fetchSearchData();
      }
    };

  // approve the Item for sale
  const approveItem = (id) => {
    fetch(`http://localhost:4000/api/product/approve/${id}`)
    .then((response) => {
      if (response.status == 200) {
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
              <span className="font-bold">Search by VIN</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
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
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  More Options
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {purchase.map((element, index) => {
                return (
                  <tr key={element._id} className={element.state == 'on sale' ? 'bg-green-100' : 'bg-white'}>
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
                      {new Date(element.purchaseDate).toLocaleDateString() ==
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
                          Edit
                        </span>
                        <span
                          className="text-red-600 px-2 cursor-pointer"
                          onClick={() => deleteItem(element._id)}
                        >
                          Delete
                        </span>
                        <span
                          className="text-blue-600 px-2 cursor-pointer"
                          onClick={() => approveItem(element._id)}
                        >
                          {element.state}
                        </span>
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
