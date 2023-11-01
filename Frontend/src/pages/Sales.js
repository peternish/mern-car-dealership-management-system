import React, { useState, useEffect } from "react";
import AddSale from "../components/AddSale";
import {Popover,
        PopoverHandler,
        PopoverContent,
        } from '@material-tailwind/react';
import SearchByVIN from "../components/SearchByVIN";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([

  ]);
  const [updatePage, setUpdatePage] = useState(true);
  const [vinArray, setVINArray] = useState([]);
  const [updateInfo, setUpdateInfo] = useState([]);

  useEffect(() => {
    fetchSalesData();
    fetchVINNumber();
  }, [updatePage]);

  // Fetching Data of All Sales
  const fetchSalesData = () => {
    fetch('http://localhost:4000/api/sales/get',
    {
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetch VIN Numbers of cars on sale
  const fetchVINNumber = () => {
    fetch('http://localhost:4000/api/product/getVIN', {
      method: 'POST',
    })
    .then((res) => res.json())
    .then((res) => {
      setVINArray(res);
    })
    .catch((err) => console.log(err));
  }

  // Modal for Sale Add
  const addSaleModalSetting = (element) => {
    setUpdateInfo(element);
    setShowSaleModal(!showSaleModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            handlePageUpdate={handlePageUpdate}
            vinArray={vinArray}
            updateInfo={updateInfo}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Sales</span>
              <SearchByVIN />
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}
              >
                Add Sales
              </button>
            </div>
          </div>

          <table id="myTb" className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  VIN Number
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Sales Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Payment Type
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Price
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Income
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sales.map((element, index) => {
                return (
                  <tr key={element._id} className={element.income.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0) >= element.price ? 'bg-green-100' : element.income.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0) >= 0.7 * element.price ? 'bg-yellow-100' : 'bg-pink-100'}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.vin}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.salesDate[element.salesDate.length - 1]}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.paymentType}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.price}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <Popover>
                        <PopoverHandler>
                        <span>{element.income.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0)}</span>
                        </PopoverHandler>
                        <PopoverContent>
                          <div className="grid grid-cols-2">
                            <div className="grid">
                              {element.salesDate.map((date, index) => {
                                return <p key={`${element._id}${date}${index}`}>{date}: </p>
                              })}
                            </div>
                            <div className="ml-3">
                              {element.income.map((item, index) => {
                                return <p key={`${element._id}${item}${index}`}>{item}</p>
                              })}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      <span
                          className="text-green-700 cursor-pointer"
                          onClick={() => addSaleModalSetting(element)}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
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

export default Sales;
