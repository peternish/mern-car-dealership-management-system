import React, { useState, useEffect, useContext } from "react";
import AddProposalNoteDetail from "../components/AddProposal";
import UpdateProposalModal from "../components/UpdateProposal";
import AuthContext from "../AuthContext";

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
        console.log(data);
        setAllProposalData(data);
      })
      .catch((err) => console.log(err));
  };

  // set the row's state as read
  const readItem = (name) => {
    fetch(`http://localhost:4000/api/proposal/read/${name}`,
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
                  Subject
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Message
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  More
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {proposal.map((element, index) => {
                return (
                  <tr key={element._id} className={element.state === 'edited' ? 'bg-yellow-100' : element.state == 'read' ? 'bg-green-100' : 'bg-white'}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.subject}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.message}
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
                          Edit
                      </span>
                    </td>
                    {JSON.parse(localStorage.getItem('user')).email === 'peter95613@gmail.com'
                      ?  
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                          className="text-blue-700 cursor-pointer"
                          onClick={() => readItem(element.name)}
                        >
                          Read
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
