import React, { useState, useEffect } from "react";
import bgImg from "../assets/bg.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MdOutlineMenu } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
function Navbar() {
  const [width, setWidth] = useState({ winWidth: window.innerWidth });
  const detectSize = () => {
    setWidth({
      winWidth: window.innerWidth,
    });
  };
  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [width]);
  const breakpoint = 500;
  return (
    <div>
      {/* Navbar Section */}
      <div
        className="bg-black h-screen mob:w-full"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {innerWidth > breakpoint ? (
          <div className="text-white flex justify-between items-center font-semibold px-10 p-3 pt-6">
            <div className="h-8 w-8 cursor-pointer border-2">
              <img src="" alt="" />
            </div>
            <ul className="flex gap-x-10">
              <Link to="/resturants">
                <li className="cursor-pointer hover:text-[#c7c7c7] transition-all">
                  Restaurant
                </li>
              </Link>

              <li className="cursor-pointer hover:text-[#c7c7c7] transition-all">
                Hot Deals
              </li>
              <li className="cursor-pointer hover:text-[#c7c7c7] transition-all">
                Help
              </li>
            </ul>
            <Link to="/resturants">
              <button className="p-2 rounded-lg bg-[#2bcca0] hover:bg-[#088f6b] text-white px-6 transition-all">
                Booking
              </button>
            </Link>
          </div>
        ) : (
          <ResponsiveNavbar />
        )}

        <div className="text-white titleFont text-4xl mob:text-4xl mob:text-center flex flex-col mob:p-2 mob:pl-5 p-12 py-10 pt-28 mob:pt-20 ">
          <span>Your Table Awaits</span>
          <span className="text-2xl  mob:text-2xl ">
            Book Now for Unforgettable Moments!
          </span>
          <div>
            <Link to="/resturants">
              <button className="font-sans text-lg border p-1 px-3 rounded mt-10 hover:bg-white hover:text-black font-semibold transition-all">
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

function ResponsiveNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" },
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const handleMenuBtn = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <div className="flex justify-end p-6">
        <button onClick={handleMenuBtn} className="text-2xl text-white ">
          <MdOutlineMenu />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={handleMenuBtn}
            ></motion.div>
            <motion.div
              className="bg-[#000000c6] w-[80%] h-full fixed top-0 right-0 z-50 overflow-y-auto"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="flex justify-end p-6">
                <button
                  className="text-2xl text-right text-white pr-2 pt-2"
                  onClick={handleMenuBtn}
                >
                  <RxCross2 />
                </button>
              </div>
              <ul className="space-y-4 p-2 pl-10 text-white">
                <Link to="/resturants">
                  <motion.li
                    className="cursor-pointer transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Restaurant
                  </motion.li>
                </Link>
                <motion.li
                  className="cursor-pointer transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Hot Deals
                </motion.li>
                <motion.li
                  className="cursor-pointer transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Help
                </motion.li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
