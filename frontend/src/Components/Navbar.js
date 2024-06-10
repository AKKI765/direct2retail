import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiCartAlt } from "react-icons/bi";
import { jwtDecode } from "jwt-decode";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const [name, setName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMerchant, setIsMerchant] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const navigate = useNavigate();


  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = useCallback(async () => {
    await localStorage.removeItem("token");
    await setName(null);
    await setIsAdmin(false)
    await setIsMerchant(false)
    await new Promise(resolve => setTimeout(resolve, 200)); // Delay the navigation using a promise
    navigate("/login");
  }, [navigate]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setName(decodedToken.name);
      setIsAdmin(decodedToken.isAdmin);
      setIsMerchant(decodedToken.isMerchant)
    } else {
      setName(null);
    }
  }, [navigate]);


  return (
    <>
      <section className="bg-blue-500">
        <nav className="relative px-4 py-4 flex justify-between items-center bg-white shadow-md">
          <Link className="text-3xl font-bold leading-none" to={"/rack-store"}>
            <img
              src="./D2R logo.jpeg"
              className="mix-blend-multiply w-14 ml-3"
              alt=""
            />
          </Link>
          <div className="lg:hidden">
            <button className="navbar-burger flex items-center text-blue-600 p-3" onClick={handleToggleMenu}>
              <svg
                className="block h-4 w-4 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
              </svg>
            </button>
          </div>
          <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6">
            {isAdmin && (
              <>
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/admin-home"}
                  >
                    Home
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>

                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/users-list"}
                  >
                    Users
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>

                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/merchants-list"}
                  >
                    Merchants
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>

                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/admin-manage"}
                  >
                    Manage
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>

                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/chat-users"}
                  >
                    Chat
                  </Link>
                </li>


                
              </>
            )}

{isMerchant && (
              <>
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/merchant-orders"}
                  >
                    Orders
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>

                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/merchant-create"}
                  >
                    Create
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>
                
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/merchant-manage"}
                  >
                    Manage
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/merchant-history"}
                  >
                    History
                  </Link>
                </li>

                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/merchant-chat"}
                  >
                    Chat
                  </Link>
                </li>


                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/help-support"}
                  >
                    Chat Support
                  </Link>
                </li>


              </>
            )}
            {!isAdmin && !isMerchant && name && (
              <>
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/rack-store"}
                  >
                    Home
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                    to={"/cart"}
                  >
                    <BiCartAlt size={20} />
                    Cart
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>

                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/history"}
                  >
                    History
                  </Link>
                </li>
                <li className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 current-fill"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </li>

                <li>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-700"
                    to={"/chat"}
                  >
                    Support
                  </Link>
                </li>
              </>
            )}
          </ul>
          {!(isAdmin || isMerchant || name) && (
            <>
              <Link
                className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold  rounded-xl transition duration-200"
                to={"/login"}
              >
                Log In
              </Link>
              <Link
                className="hidden lg:inline-block py-2 px-6 bg-green-500 hover:bg-green-600 text-sm lg:mr-3 text-white font-bold rounded-xl transition duration-200"
                to={"/merchant-signup"}
              >
                Merchant SignUp
              </Link>
              <Link
                className="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
                to={"/signup"}
              >
                User SignUp
              </Link>
            </>
          )}
          {(isAdmin || isMerchant || name) && (
            <>
              <Link
                className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-3 text-sm text-gray-600 hover:text-gray-900 font-bold  rounded-xl transition duration-200"
                onClick={handleLogout}
              >
                Log Out
              </Link>
              <Link className="hidden py-2 px-6 text-sm lg:mr-3 text-black lg:flex items-center justify-center gap-2 font-bold transition duration-200">
                <CgProfile size={20} />
                {name}
              </Link>
            </>
          )}
        </nav>
        <div className={`navbar-menu relative z-50  ${isMenuOpen ? "block" : "hidden"}`} onClick={handleToggleMenu}>
          <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
            <div className="flex items-center mb-8">
              <Link className="mr-auto text-3xl font-bold leading-none" to={"/rack-store"}>
                <img
                  src="./D2R logo.jpeg"
                  className="mix-blend-multiply w-14 ml-3"
                  alt=""
                />
              </Link>
              <button className="navbar-close">
                <svg
                  className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div>
              <ul>
                {isAdmin && (
                  <>
                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/admin-home"}
                      >
                        Home
                      </Link>
                    </li>

                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/users-list"}
                      >
                        Users
                      </Link>
                    </li>

                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/merchants-list"}
                      >
                        Merchants
                      </Link>
                    </li>

                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/admin-manage"}
                      >
                        Manage
                      </Link>
                    </li>

                    
                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/chat-users"}
                      >
                        Chat
                      </Link>
                    </li>
                  </>
                )}
                {isMerchant && (
                  <>
                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/merchant-orders"}
                      >
                        Orders
                      </Link>
                    </li>

                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/merchant-create"}
                      >
                        Create
                      </Link>
                    </li>
                    
                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/merchant-manage"}
                      >
                        Manage
                      </Link>
                    </li>
                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/merchant-history"}
                      >
                        History
                      </Link>
                    </li>
                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/merchant-chat"}
                      >
                        Chat
                      </Link>
                    </li>
                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/help-support"}
                      >
                        Chat Support
                      </Link>
                    </li>
                  </>
                )}
                {!isAdmin && !isMerchant && name && (
                  <>
                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/rack-store"}
                      >
                        Home
                      </Link>
                    </li>

                    <li className="mb-1">
                      <Link
                        className="flex items-center gap-3 p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/cart"}
                      >
                        <BiCartAlt size={20} />
                        Cart
                      </Link>
                    </li>

                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/history"}
                      >
                        History
                      </Link>
                    </li>

                    <li className="mb-1">
                      <Link
                        className="block p-4 text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        to={"/chat"}
                      >
                        Support
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="mt-auto">
              <div className="pt-6">
                {!(isAdmin || isMerchant || name) && (
                  <>
                    <Link
                      className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl"
                      to={"/login"}
                    >
                      Log In
                    </Link>
                    <Link
                      className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-green-600 hover:bg-green-700  rounded-xl"
                      to={"/merchant-signup"}
                    >
                      Merchant SignUp
                    </Link>
                    <Link
                      className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl"
                      to={"/signup"}
                    >
                      User SignUp
                    </Link>
                  </>
                )}
                {(isAdmin || isMerchant || name) && (
                  <>
                    <Link
                      className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Link>
                    <Link className="flex justify-center items-center gap-2 px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl">
                      <CgProfile size={20} />
                      {name}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </section>
    </>
  );
};

export default Navbar;
