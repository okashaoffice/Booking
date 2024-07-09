import React, { useState } from "react";
import { motion } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
const Fields = [
  { label: "Name", type: "text", id: "name" },
  { label: "Email", type: "email", id: "email" },
  { label: "Phone Number", type: "tel", id: "phone" },
  { label: "Persons", type: "number", id: "persons" },
  { label: "Date", type: "date", id: "date" },
  { label: "Time", type: "text", id: "time" },
];

function Form({ isOpen, onClose, selectedRestaurant }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    persons: "",
    date: "",
    time: "", 
    note: "",
    period: "AM",
  });
  const response = false;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedTime = `${formData.time} ${formData.period}`;
      await setDoc(doc(db, "bookings", formData.email), {
        restaurant: selectedRestaurant,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        persons: parseInt(formData.persons),
        date: formData.date,
        time: formattedTime,
        note: formData.note,
        response: response,
      });
      alert("Booking Request Sent Successfully");
      console.log("Form data successfully sent to Firestore!");
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        persons: "",
        date: "",
        time: "",
        note: "",
        period: "AM", 
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0  w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="bg-[#000000a2] border p-6 mob:px-2 mob:w-[90%] mob:py-6 rounded-lg max-w-md border-t-8 border-[#2bcca0]">
          <h2 className="text-2xl text-white font-bold mb-4">
            {selectedRestaurant} : Table Booking Form
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2  gap-x-4 gap-y-2 ">
              {Fields.map((data, index) => (
                <div key={index} className="">
                  <label
                    htmlFor={data.id}
                    className="block text-sm font-medium text-white"
                  >
                    {data.label}
                  </label>
                  {data.id === "time" ? (
                    <div className="flex">
                      <input
                        type="time"
                        id={data.id}
                        name={data.id}
                        value={formData[data.id]}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <select
                        name="period"
                        value={formData.period}
                        onChange={handleInputChange}
                        className="mt-1 ml-2 block px-3 py-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  ) : (
                    <input
                      type={data.type}
                      required
                      id={data.id}
                      name={data.id}
                      value={formData[data.id]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <textarea
              placeholder="Special note..."
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              required
              className="border mt-6 border-black rounded h-20 outline-none pl-2 w-full pt-1 text-sm"
            ></textarea>
            <div></div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 transition-all bg-[#2bcca0] text-white rounded-md hover:bg-[#189f7b]"
              >
                Book Table
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Form;
