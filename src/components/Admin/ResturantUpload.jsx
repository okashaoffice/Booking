import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GrCloudUpload } from "react-icons/gr";
import { FaUsers } from "react-icons/fa";
import {
  setDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../config/FirebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { MdHomeFilled, MdDelete } from "react-icons/md";
import { GoUpload } from "react-icons/go";
import { Link } from "react-router-dom";

function ResturantUpload() {
  const [name, setName] = useState("");
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [menuCardImage, setMenuCardImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [uploadFormOpen, setUploadFormOpen] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        const fetchedRestaurants = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(fetchedRestaurants);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!restaurantImage || !menuCardImage || !name) {
        setErrorMsg("Please fill out all fields");
        return;
      }

      setLoading(true);

      // Upload restaurant image
      const restaurantImageRef = ref(
        storage,
        `restaurant_images/${restaurantImage.name}`
      );
      const restaurantImageSnapshot = await uploadBytes(
        restaurantImageRef,
        restaurantImage
      );
      const restaurantImageUrl = await getDownloadURL(
        restaurantImageSnapshot.ref
      );

      const menuCardImageRef = ref(
        storage,
        `menu_card_images/${menuCardImage.name}`
      );
      const menuCardImageSnapshot = await uploadBytes(
        menuCardImageRef,
        menuCardImage
      );
      const menuCardImageUrl = await getDownloadURL(menuCardImageSnapshot.ref);

      await setDoc(doc(db, "restaurants", name), {
        name: name,
        restaurantImageUrl: restaurantImageUrl,
        menuCardImageUrl: menuCardImageUrl,
      });

      setName("");
      setRestaurantImage(null);
      setMenuCardImage(null);
      setLoading(false);
      setErrorMsg("");
      alert("Restaurant data successfully !");
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorMsg(error.message);
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      await deleteDoc(doc(db, "restaurants", id));
      alert("Restaurant deleted successfully!");
      console.log("Restaurant deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const handleUploadForm = () => {
    setUploadFormOpen((prev) => !prev);
  };
  const handleFilterData = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    // Filter restaurants based on the filter value
    const filteredData = value
      ? restaurants.filter((restaurant) =>
          restaurant.name.toLowerCase().includes(value)
        )
      : restaurants;

    setRestaurants(filteredData);
  };

  return (
    <div className="bg-white">
      <div className="flex">
        <Sidebar />
        <section className="mx-auto w-[80%] px-4 py-4 pt-10">
          <div className="flex  justify-between ">
            <h1 className="text-2xl pl-2 p-2 font-semibold ">Resturant Data</h1>
            <button
              className="bg-primaryColor text-white px-4 py-2 rounded-md mr-2"
              onClick={handleUploadForm}
            >
              Upload resturant
            </button>
          </div>
          <div className="pt-9">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-md placeholder:text-sm pl-2 px-2 py-1 outline-none border-gray-400 "
              onChange={handleFilterData}
            />
          </div>
          <div className="mt-6 flex flex-col pt-1">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle h-[25rem] md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                          Name
                        </th>
                        <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                          Restaurant Image
                        </th>
                        <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                          Menu Card Image
                        </th>
                        <th className="px-4 py-3.5 text-center text-sm font-normal text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {restaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                          <td className="whitespace-nowrap px-4 text-center py-4">
                            {restaurant.name}
                          </td>
                          <td className="whitespace-nowrap px-4 text-center py-4">
                            <img
                              src={
                                restaurant.restaurantImageUrl
                                  ? restaurant.restaurantImageUrl
                                  : restaurant.imageUrl
                              }
                              alt="Restaurant"
                              className="h-16 w-16 object-cover mx-auto"
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 text-center py-4">
                            {restaurant.menuCardImageUrl ? (
                              <img
                                src={restaurant.menuCardImageUrl}
                                alt="Restaurant"
                                className="h-16 w-16 object-cover mx-auto"
                              />
                            ) : (
                              <div className="text-black text-sm">
                                Menu card does not exist
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 text-center py-4">
                            <button
                              onClick={() => handleDeleteDoc(restaurant.id)}
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
      {uploadFormOpen && (
        <UploadForm
          name={name}
          setName={setName}
          restaurantImage={restaurantImage}
          setRestaurantImage={setRestaurantImage}
          menuCardImage={menuCardImage}
          setMenuCardImage={setMenuCardImage}
          loading={loading}
          errorMsg={errorMsg}
          handleSubmit={handleSubmit}
          setUploadFormOpen={setUploadFormOpen}
          handleUploadForm={handleUploadForm}
        />
      )}
    </div>
  );
}

function UploadForm({
  name,
  setName,
  restaurantImage,
  setRestaurantImage,
  menuCardImage,
  setMenuCardImage,
  loading,
  errorMsg,
  handleSubmit,
  handleUploadForm,
}) {
  const renderImagePreview = (image) => {
    if (!image) {
      return null;
    }
    return (
      <div className="flex items-center mt-2">
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="h-16 w-16 object-cover rounded-md"
        />
        <button
          className="ml-2 text-red-600 hover:text-red-900"
          onClick={() => {
            if (image === restaurantImage) {
              setRestaurantImage(null);
            } else if (image === menuCardImage) {
              setMenuCardImage(null);
            }
          }}
        >
          <MdDelete />
        </button>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-[#000000a2] border p-6 rounded-lg w-1/2 border-t-8 border-[#2bcca0]">
        <h2 className="text-2xl text-white font-bold mb-4">
          Restaurant Detail Upload Form
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                Name of the Restaurant
              </label>
              <input
                type="text"
                value={name}
                placeholder="Restaurant Name"
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />

              {/* Upload Restaurant Image */}
              <label
                htmlFor="restaurant-image-upload"
                className="text-white rounded cursor-pointer flex items-center border gap-x-3 p-1 justify-center"
              >
                Upload Restaurant Image <GrCloudUpload />
              </label>
              <input
                id="restaurant-image-upload"
                type="file"
                className="hidden"
                onChange={(e) => setRestaurantImage(e.target.files[0])}
              />
              {renderImagePreview(restaurantImage)}

              {/* Upload Menu Card Image */}
              <label
                htmlFor="menu-card-image-upload"
                className="text-white rounded cursor-pointer flex items-center border gap-x-3 p-1 justify-center"
              >
                Upload Menu Card Image <GrCloudUpload />
              </label>
              <input
                id="menu-card-image-upload"
                type="file"
                className="hidden"
                onChange={(e) => setMenuCardImage(e.target.files[0])}
              />
              {renderImagePreview(menuCardImage)}
            </div>
            <p className="text-red-500 text-center font-semibold pt-2">
              {errorMsg}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300"
                onClick={handleUploadForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 transition-all bg-[#2bcca0] text-white rounded-md hover:bg-[#189f7b]"
              >
                Upload
              </button>
            </div>
          </div>
        </form>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl loader"></div>
        </div>
      )}
    </motion.div>
  );
}

function Sidebar() {
  return (
    <div className="bg-gray-200 p-2 space-y-5 pt-6 rounded w-[15%]  max-h-screen">
      <span className="bg-primaryColor text-white p-2 ml-3 ">Admin Panel</span>

      <ul className="">
        <Link to="/dashboard">
          <li className="flex items-center gap-x-2 text-base font-semibold hover:rounded hover:bg-gray-300 p-2 cursor-pointer transition-all">
            <MdHomeFilled /> Home
          </li>
        </Link>
        <Link to="/upload">
          <li className="flex items-center gap-x-2 text-base font-semibold hover:rounded hover:bg-gray-300 p-2  cursor-pointer transition-all">
            <GoUpload /> Upload Restaurant
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

export default ResturantUpload;
