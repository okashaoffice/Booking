import React, { useEffect, useState } from "react";
import { MdHomeFilled } from "react-icons/md";
import { GoUpload } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { MdDelete } from "react-icons/md";
import { db } from "../../config/FirebaseConfig";
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchUserData = onSnapshot(collection(db, "users"), (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(newData);
      setLoading(false);
    });
    return () => fetchUserData();
  }, []);

  const handleDeleteDoc = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "users", id));
      alert("User successfully deleted!");
      setUsers((prevData) => prevData.filter((data) => data.id !== id));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleToggleAdmin = async (id, currentIsAdmin) => {
    try {
      setSelectedUserId(id);
      setConfirmationDialog(true);
    } catch (error) {
      console.error("Error toggling isAdmin status: ", error);
    }
  };

  const confirmToggleAdmin = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, "users", selectedUserId);
      const currentIsAdmin =
        users.find((user) => user.id === selectedUserId)?.isAdmin || false;
      await updateDoc(userRef, { isAdmin: !currentIsAdmin });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUserId
            ? { ...user, isAdmin: !currentIsAdmin }
            : user
        )
      );
      alert(
        ` User status successfully updated to ${
          !currentIsAdmin ? "(isAdmin)" : " (Not Admin)"
        }`
      );
      setConfirmationDialog(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating isAdmin status: ", error);
      setLoading(false);
    }
  };
  const cancelToggleAdmin = () => {
    setConfirmationDialog(false);
    setSelectedUserId(null);
  };

  return (
    <div className="bg-white">
      <div className="flex h-screen">
        <Sidebar />
        <section className="mx-auto w-[75%] px-4 py-4 pt-10">
          <div className="flex justify-between">
            <h1 className="text-2xl pl-2 p-2 font-semibold">Registerd Users</h1>
          </div>
          <div className="mt-6 flex flex-col pt-1">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle h-[25rem] md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                          User Name
                        </th>
                        <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                          Email
                        </th>
                        <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                          isAdmin
                        </th>
                        <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users.map((data) => (
                        <tr key={data.id}>
                          <td className="whitespace-nowrap px-4 text-center py-4">
                            {data.userName}
                          </td>
                          <td className="whitespace-nowrap px-4 text-center py-4">
                            {data.email}
                          </td>
                          <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                            <button
                              className={`rounded-full text-center px-2 py-1 border-b text-sm ${
                                data.isAdmin
                                  ? "bg-green-300 text-white"
                                  : "bg-red-400 text-black"
                              }`}
                              onClick={() =>
                                handleToggleAdmin(data.id, data.isAdmin)
                              }
                            >
                              {data.isAdmin ? "is Admin" : "is Not Admin"}
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-4 text-center py-4">
                            <button
                              onClick={() => handleDeleteDoc(data.id)}
                              className="text-red-600 hover:text-red-900 text-lg hover:scale-150 transition-all"
                            >
                              <MdDelete />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl loader"></div>
        </div>
      )}
      {confirmationDialog && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <MdHomeFilled
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to update isAdmin status?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmToggleAdmin}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={cancelToggleAdmin}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Users;

function Sidebar() {
  return (
    <div className="bg-gray-200 p-2 space-y-5 pt-6 rounded w-[20%]  max-h-screen">
      <span className="bg-primaryColor text-white p-2 ml-3 ">Admin Panel</span>

      <ul className="">
        <Link to="/dashboard">
          <li className="flex items-center gap-x-2 text-base font-semibold hover:rounded hover:bg-gray-300 p-2 cursor-pointer transition-all">
            <MdHomeFilled /> Home
          </li>
        </Link>
        <Link to="/upload">
          <li className="flex items-center gap-x-2 text-base font-semibold hover:rounded hover:bg-gray-300 p-2  cursor-pointer transition-all">
            <GoUpload /> Upload Resturant
          </li>
        </Link>
        <Link to="/users">
          <li className="flex items-center gap-x-2 text-base font-semibold hover:rounded hover:bg-gray-300 p-2  cursor-pointer transition-all">
            <FaUsers /> Users
          </li>
        </Link>
      </ul>
    </div>
  );
}
