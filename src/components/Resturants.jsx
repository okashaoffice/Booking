// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import BookingFormModal from "./Form";
// import bgres from "../assets/resbg.jpg";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../config/FirebaseConfig";
// import { LuMenuSquare } from "react-icons/lu";
// import menue from "../assets/menue.jpg";
// import { RxCross2 } from "react-icons/rx";
// function Resturants() {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [fetchResData, setFetchResData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [selectedRestaurantMenu, setSelectedRestaurantMenu] = useState(null);

//   const openModal = (name) => {
//     setSelectedRestaurant(name);
//     setShowModal(true);
//   };
//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedRestaurant(null);
//   };
//   useEffect(() => {
//     const getResturantData = async () => {
//       try {
//         setLoading(true);
//         const resturantCollection = collection(db, "restaurants");
//         const response = await getDocs(resturantCollection);
//         const filterData = response.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setFetchResData(filterData);
//         setLoading(false);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getResturantData();
//   }, []);

//   const handleMenueCard = (restaurant) => {
//     setSelectedRestaurantMenu(restaurant);
//     setShowMenu(true);
//   };
//   return (
//     <motion.div
//       className="scrollbar"
//       initial={{
//         opacity: 0,
//         scale: 0.1,
//       }}
//       whileInView={{
//         opacity: 1,
//         scale: 1,
//         transition: {
//           type: "spring",
//           stiffness: 100,
//           damping: 30,
//         },
//       }}
//     >
//       <div
//         className="bg-[#000000b2] h-full overflow-x-hidden w-full "
//         style={{ backgroundImage: `url(${bgres})`, backgroundSize: "cover" }}
//       >
//         <div>
//           <h1 className="text-white text-2xl resFont text-center mob:text-xl pt-10">
//             Find Your Favorite Spot, Reserve with Ease
//           </h1>
//           <div>--</div>
//           <div className="pb-11 grid grid-cols-4 gap-4 p-4 mob:flex flex-col ">
//             {fetchResData.map((data, index) => (
//               <div
//                 key={index}
//                 className="bg-black cursor-pointer h-52 rounded-xl relative"
//                 style={{
//                   backgroundImage: `url(${
//                     data.imageUrl ? data.imageUrl : data.restaurantImageUrl
//                   })`,
//                   backgroundSize: "cover",
//                   backgroundRepeat: "no-repeat",
//                 }}
//               >
//                 <div className="hover:bg-[#000000a9] bg-opacity-75 transition-all h-full w-full absolute top-0 rounded-xl  opacity-0 hover:opacity-100">
//                   <motion.div
//                     whileHover={{
//                       scale: 1.3,
//                     }}
//                     whileTap={{ scale: 1 }}
//                     className="absolute text-white text-2xl p-2"
//                   >
//                     <button onClick={handleMenueCard}>
//                       <LuMenuSquare />
//                     </button>
//                   </motion.div>
//                   <div className="flex flex-col justify-center items-center h-full w-full">
//                     <h1 className="text-white titleFont text-xl">
//                       {data.name}
//                     </h1>
//                     <button
//                       className="font-sans text-sm border bg-black bg-opacity-75 text-white p-1 px-3 mt-2 rounded hover:bg-white hover:text-black font-semibold transition-all"
//                       onClick={() => openModal(data.name)}
//                     >
//                       Book Now
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       {showMenu && (
//         <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col justify-center items-center z-50">
//           <div className="flex justify-end w-1/3 mob:w-full">
//             <button
//               className="text-2xl text-white pr-2 pt-2"
//               onClick={() => setShowMenu(false)}
//             >
//               <RxCross2 />
//             </button>
//           </div>
//           <img
//             src={selectedRestaurantMenu.menuCardImageUrl}
//             alt=""
//             className="h-[32rem] mob:h-[25rem]"
//           />
//         </div>
//       )}
//       <BookingFormModal
//         isOpen={showModal}
//         onClose={closeModal}
//         selectedRestaurant={selectedRestaurant}
//       />
//       {loading && (
//         <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
//           <div className="text-white text-xl loader"></div>
//         </div>
//       )}
//     </motion.div>
//   );
// }
// export default Resturants;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BookingFormModal from "./Form";
import bgres from "../assets/resbg.jpg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { LuMenuSquare } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

function Resturants() {
  const [showModal, setShowModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [fetchResData, setFetchResData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedRestaurantMenu, setSelectedRestaurantMenu] = useState(null);

  const openModal = (name) => {
    setSelectedRestaurant(name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);
  };

  useEffect(() => {
    const getResturantData = async () => {
      try {
        setLoading(true);
        const resturantCollection = collection(db, "restaurants");

        const response = await getDocs(resturantCollection);
        const filterData = response.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFetchResData(filterData);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getResturantData();
  }, []);

  const handleMenueCard = (restaurant) => {
    setSelectedRestaurantMenu(restaurant);
    setShowMenu(true);
  };

  return (
    <motion.div
      className="scrollbar"
      initial={{
        opacity: 0,
        scale: 0.1,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 30,
        },
      }}
    >
      <div
        className="bg-[#000000b2] max-h-full overflow-x-hidden w-full"
        style={{ backgroundImage: `url(${bgres})`, backgroundSize: "cover" }}
      >
        <div>
          <h1 className="text-white text-2xl resFont text-center mob:text-xl pt-10">
            Find Your Favorite Spot, Reserve with Ease
          </h1>
          <div>--</div>
          <div className="pb-11 grid grid-cols-4 gap-4 p-4 mob:flex flex-col ">
            {fetchResData.map((data, index) => (
              <div
                key={index}
                className="bg-black cursor-pointer h-52 rounded-xl relative"
                style={{
                  backgroundImage: `url(${
                    data.imageUrl ? data.imageUrl : data.restaurantImageUrl
                  })`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="hover:bg-[#000000a9] bg-opacity-75 transition-all h-full w-full absolute top-0 rounded-xl  opacity-0 hover:opacity-100">
                  <motion.div
                    whileHover={{
                      scale: 1.3,
                    }}
                    whileTap={{ scale: 1 }}
                    className="absolute text-white text-2xl p-2"
                  >
                    <button onClick={() => handleMenueCard(data)}>
                      <LuMenuSquare />
                    </button>
                  </motion.div>
                  <div className="flex flex-col justify-center items-center h-full w-full">
                    <h1 className="text-white titleFont text-xl">
                      {data.name}
                    </h1>
                    <button
                      className="font-sans text-sm border bg-black bg-opacity-75 text-white p-1 px-3 mt-2 rounded hover:bg-white hover:text-black font-semibold transition-all"
                      onClick={() => openModal(data.name)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showMenu && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col justify-center items-center z-50">
          <div className="flex justify-end w-1/3 mob:w-full">
            <button
              className="text-2xl text-white pr-2 pt-2"
              onClick={() => setShowMenu(false)}
            >
              <RxCross2 />
            </button>
          </div>
          {selectedRestaurantMenu.menuCardImageUrl ? (
            <img
              src={selectedRestaurantMenu.menuCardImageUrl}
              alt=""
              className="h-[32rem] mob:h-[25rem]"
            />
          ) : (
            <div className="text-white text-4xl">Menu card does not exist</div>
          )}
        </div>
      )}

      <BookingFormModal
        isOpen={showModal}
        onClose={closeModal}
        selectedRestaurant={selectedRestaurant}
      />
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl loader"></div>
        </div>
      )}
    </motion.div>
  );
}

export default Resturants;
