import React, { useEffect, useState } from "react";
import { MdHomeFilled } from "react-icons/md";
import { GoUpload } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../config/FirebaseConfig";
import { CiFilter } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
function AdminPanel({ handleLogout }) {
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [currentUserUsername, setCurrentUserUsername] = useState("");
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const newBooking = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFetchData(newBooking);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch username data

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
          const fetchedUsernames = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const currentUser = fetchedUsernames.find(
            (user) => user.id === auth.currentUser.uid
          );
          if (currentUser) {
            setCurrentUserUsername(currentUser.userName);
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };

    fetchUserName();
  }, []);

  const handleDeleteDoc = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "bookings", id));
      setFetchData((prevData) => prevData.filter((data) => data.id !== id));
      console.log("Document successfully deleted!");
      setLoading(false);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Send Email Response //
  const form = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await emailjs.sendForm(
        "service_r6q4l0c",
        "template_2fnmypk",
        form.current,
        {
          publicKey: "ycDr99hbo1s9Eu6fD",
        }
      );
      console.log("Successfully");
      form.current.reset();
      const bookingId = selectedBooking.id;
      await updateDoc(doc(db, "bookings", bookingId), {
        response: true,
      });
      setLoading(false);
      showResponseForm(false);
      alert("Response Send");
      setFetchData((prevData) =>
        prevData.map((booking) =>
          booking.id === bookingId ? { ...booking, response: true } : booking
        )
      );
    } catch (error) {
      console.error("FAILED...", error.text);
    }
  };
  const filteredDatawithUsers = fetchData.filter(
    (data) => data.resturant === currentUserUsername
  );

  const filteredData = filterType
    ? fetchData.filter((data) => data.response === (filterType === "responded"))
    : fetchData;

  const handleFilterPopup = () => {
    setFilterPopup((prev) => !prev);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    setFilterPopup(false);
  };

  return (
    <div className="bg-white">
      <div>
        <div className="admin flex">
          {!filteredDatawithUsers.length > 0 && <Sidebar />}
          <div
            className={`${
              filteredDatawithUsers.length > 0
                ? "w-full h-screen p-5"
                : "w-[80%] p-5"
            }`}
          >
            <div className="  flex items-center justify-between ">
              <h1 className="text-2xl pl-2 p-2 font-semibold ">Booking Data</h1>
              <button
                className="bg-primaryColor text-white px-4 py-2 rounded-md mr-2"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
            <div className="pl-2 relative pt-2">
              {filteredDatawithUsers.length > 0 ? (
                <div className="bg-white">
                  {filteredDatawithUsers.map((data) => (
                    <p key={data.id} className="text-lg font-bold  underline">
                      {data.resturant}
                    </p>
                  ))}
                </div>
              ) : (
                <button
                  className="border px-2 py-1 rounded-lg flex items-center gap-x-2 border-black"
                  onClick={handleFilterPopup}
                >
                  <CiFilter />
                  Filter
                </button>
              )}
              {filterPopup && (
                <div className="bg-white rounded  shadow-2xl ml-4 w-fit p-3  absolute">
                  <div className="text-sm items-center flex gap-x-2">
                    <input
                      type="checkbox"
                      onChange={() => handleFilter("pending")}
                      className={`${
                        filterType === "pending"
                      } ? "bg-blue-500" : "bg-white" `}
                    />{" "}
                    Panding
                  </div>
                  <div className="text-sm items-center flex gap-x-2">
                    <input
                      type="checkbox"
                      onChange={() => handleFilter("responded")}
                    />{" "}
                    Responed
                  </div>
                </div>
              )}
            </div>

            <section className="mx-auto   px-4 py-4  ">
              <div className="mt-6 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle h-[25rem] md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200  md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Resturant
                            </th>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Name
                            </th>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Email
                            </th>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Phone Number
                            </th>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Persons
                            </th>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Date
                            </th>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Time
                            </th>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Note
                            </th>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Status
                            </th>
                            <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                              Edit
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white ">
                          {/* Conditional rendering based on filteredData or filteredDatawithUsers */}
                          {filteredDatawithUsers.length > 0
                            ? filteredDatawithUsers.map((data) => (
                                <tr key={data.id}>
                                  <td className="whitespace-nowrap px-4 text-center py-4">
                                    {data.resturant}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4">
                                    {data.name}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4">
                                    {data.email}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm text-gray-700">
                                    {data.phone}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    {data.persons}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    {data.date}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    {data.time}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    {data.note}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    <button
                                      className={`rounded-full text-center px-2 py-1 border-b text-sm ${
                                        data.response
                                          ? "bg-green-300 text-white"
                                          : "bg-red-400 text-white"
                                      }`}
                                      onClick={() => {
                                        setSelectedBooking(data);
                                        setShowResponseForm(true);
                                      }}
                                    >
                                      {data.response ? "Responded" : "Pending"}
                                    </button>
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium  hover:scale-150 transition-all">
                                    <button
                                      onClick={() => handleDeleteDoc(data.id)}
                                      className="text-xl text-red-600 "
                                    >
                                      <MdDelete />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            : filteredData.map((data) => (
                                <tr key={data.id}>
                                  <td className="whitespace-nowrap px-4 text-center py-4">
                                    {data.resturant}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4">
                                    {data.name}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4">
                                    {data.email}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm text-gray-700">
                                    {data.phone}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    {data.persons}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    {data.date}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    {data.time}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    {data.note}
                                  </td>
                                  <td className="whitespace-nowrap px-4 text-center py-4 text-sm font-medium">
                                    <button
                                      className={`rounded-full text-center px-2 py-1 border-b text-sm ${
                                        data.response
                                          ? "bg-green-300 text-white"
                                          : "bg-red-400 text-white"
                                      }`}
                                      onClick={() => {
                                        setSelectedBooking(data);
                                        setShowResponseForm(true);
                                      }}
                                    >
                                      {data.response ? "Responded" : "Pending"}
                                    </button>
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium  hover:scale-150 transition-all">
                                    <button
                                      onClick={() => handleDeleteDoc(data.id)}
                                      className="text-xl text-red-600 "
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
        </div>
      </div>
      {showResponseForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Respond to Booking - {selectedBooking.resturant}
            </h2>
            <form className="flex flex-col" ref={form} onSubmit={sendEmail}>
              <label className="text-sm">Name</label>
              <input
                value={selectedBooking.name}
                type="text"
                name="user_name"
                className="border rounded p-1 mt-1 outline-none"
              />
              <label className="text-sm pt-2">Email</label>
              <input
                value={selectedBooking.email}
                type="email"
                name="user_email"
                className="border rounded p-1 mt-1 outline-none pl-2 "
              />
              <label className="pt-2 text-sm">Message</label>
              <textarea
                defaultValue={`Hello ${selectedBooking.name}, your reservation at ${selectedBooking.resturant} for ${selectedBooking.persons} persons  on ${selectedBooking.date} at ${selectedBooking.time} has been successfully booked. See you soon! Thank you for choosing us`}
                name="message"
                className="border rounded-md mt-2 h-24 outline-none pl-2 pt-2"
              />
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-primaryColor text-white px-4 py-2 rounded-md mr-2"
                >
                  Send Response
                </button>
                <button
                  onClick={() => setShowResponseForm(false)}
                  className="text-gray-600  bg-gray-200 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl loader"></div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;

function Sidebar() {
  return (
    <div className="bg-gray-200 p-2 space-y-5 pt-6 rounded w-[20%]  max-h-screen">
      <span className="bg-primaryColor text-white p-2 ml-3 ">Admin Panel</span>

      <ul className="">
        <li className="flex items-center gap-x-2 text-base font-semibold hover:rounded hover:bg-gray-300 p-2 cursor-pointer transition-all">
          <MdHomeFilled /> Home
        </li>
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
