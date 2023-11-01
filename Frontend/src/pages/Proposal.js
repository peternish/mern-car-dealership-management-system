import React, { useState, useEffect, useContext } from "react";
import AddProposalNoteDetail from "../components/AddProposal";
import UpdateProposalModal from "../components/UpdateProposal";
import AuthContext from "../AuthContext";
import { Popover, PopoverContent, PopoverHandler, Typography } from "@material-tailwind/react";

function ProposalDetails() {
  const [proposal, setAllProposalData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProposal, setUpdateProposal] = useState([]);
  const [showProposalModal, setProposalModal] = useState(false);
  const [updatePage, setUpdatePage] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchProposalData();
  }, [updatePage]);

  // Fetching Data of All Purchase items
  const fetchProposalData = () => {
    fetch('http://localhost:4000/api/proposal/get',
      {method: 'POST'})
      .then((res) => res.json())
      .then((data) => {
        setAllProposalData(data);
      })
      .catch((err) => console.log(err));
  };

  // set the row's state as read
  const readItem = (id) => {
    fetch(`http://localhost:4000/api/proposal/read/${id}`,
    {
      method: 'POST'
    })
    .then((res) => {
      if (res.status === 200) {
        setUpdatePage(!updatePage);
      } else {
        alert('Sorry. Please retry.')
      }
    })
  }

  // Modal for Proposal Add
  const addProposalModalSetting = () => {
    setProposalModal(!showProposalModal);
  };

  // Modal for Proposal Edit
  const updateProposalModalSetting = (element) => {
    setUpdateProposal(element);
    setShowUpdateModal(!showUpdateModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">

        {showProposalModal && (
          <AddProposalNoteDetail
            addProposalModalSetting={addProposalModalSetting}
            handlePageUpdate={handlePageUpdate}
            authContext = {authContext}
          />
        )}

        {showUpdateModal && (
          <UpdateProposalModal 
            updateModalSetting={updateProposalModalSetting}
            handlePageUpdate={handlePageUpdate}
            updateProposal={updateProposal}
          />
        )}
        
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Message Room</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addProposalModalSetting}
              >
                Leave a Message
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  VIN
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Message
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {proposal.map((element, index) => {
                return (
                  <tr key={element._id} className={element.state === 'edited' ? 'bg-yellow-100' : element.state === 'read' ? 'bg-green-100' : 'bg-white'}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.subject}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <Popover placement="top-end">
                        <Typography style={{width:'200'}}>
                        <PopoverHandler>   
                          <span>{element.message}</span>
                        </PopoverHandler>
                        <PopoverContent>
                          <span>{element.message}</span>
                        </PopoverContent>
                        </Typography>
                      </Popover>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(element.date).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : new Date(element.date).toLocaleDateString()}
                    </td>   
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                          className="text-green-700 cursor-pointer"
                          onClick={() => updateProposalModalSetting(element)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                      </span>
                    </td>
                    {JSON.parse(localStorage.getItem('user')).email === 'peter95613@gmail.com'
                      ?  
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                          className="text-blue-700 cursor-pointer"
                          onClick={() => readItem(element._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
                          </svg>
                      </span>
                      </td>
                      :
                      <></>
                    }
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

export default ProposalDetails;
