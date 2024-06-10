import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../Context/ToastContext";

const UsersList = () => {
  const { showSuccessToast } = useToast();
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState([]);
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      let response = await axios.get(`${API_URL}/api/user`);
      let filteredResponse = response.data.filter(
        ({ isAdmin, isMerchant }) => !isAdmin && !isMerchant
      );
      setUser(filteredResponse);
    };
    fetchUsers();
  }, [API_URL, deleted]);

  const handleDelete = (userId) => {
    let response = axios.delete(`${API_URL}/api/user/${userId}`);
    showSuccessToast(response.message);
    setDeleted(!deleted);
  };
  return (
    <div>
      <section className="flex items-center justify-center w-full mt-4 lg:max-w-4xl lg:mx-auto">
        <div className="container">
          <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg my-5">
            <thead className="text-white">
              {user?.map((item) => (
                <tr className="bg-black flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">GST</th>
                  <th className="p-3 text-left" width="110px">
                    Actions
                  </th>
                </tr>
              ))}
            </thead>
            <tbody className="flex-1 sm:flex-none">
              {user?.map((item, index) => (
                <tr className="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0">
                  <td className="border-grey-light border hover:bg-gray-100 p-3">
                    {item.name}
                  </td>
                  <td className="border-grey-light border hover:bg-gray-100 p-3 truncate">
                    {item.email}
                  </td>
                  <td className="border-grey-light border hover:bg-gray-100 p-3 truncate">
                    {item.gst || " "}
                  </td>
                  <td
                    className="border-grey-light border hover:bg-gray-100 p-3 text-red-400 hover:text-red-600 hover:font-medium cursor-pointer"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UsersList;
