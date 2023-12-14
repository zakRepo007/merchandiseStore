
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';
import { useSilentAuthentication } from '@/components/SilentAuthentication';
import ApiService from '@/utils/ApiService';
import { format } from 'date-fns';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '@/utils/authRedirect';



const Dashboard = () => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ name: '', price: '' });
  const [isInsertFormOpen, setIsInsertFormOpen] = useState(false);
  const [newData, setNewData] = useState({ name: '', price: '' });

  const { isAuthenticated } = useAuth();

  // If not authenticated, the useAuth hook will redirect to the login page
  if (!isAuthenticated) {
    return <div>You are not authroized to access that page...</div>;
  }

  const openInsertForm = () => {
    setIsInsertFormOpen(true);
  };

  const closeInsertForm = () => {
    setIsInsertFormOpen(false);
    setNewData({ name: '', price: '' });
  };

  const handleNewDataChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleInsertSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.insertData(localStorage.getItem("accesToken"), newData);
      closeInsertForm();
      fetchAndUpdateData();
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  const handleEditClick = (recordId: any, name: any, price: any) => {
    setEditingId(recordId);
    setEditedData({ name, price });
  };

  const handleSaveClick = async (recordId: any) => {
    try {
      await ApiService.updateData(localStorage.getItem("accesToken"), recordId, editedData);
      setEditingId(null);
      fetchAndUpdateData();
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditedData({ name: '', price: '' });
  };

  const handleDelete = async (recordId: any) => {
    try {
      await ApiService.deleteData(localStorage.getItem("accesToken"), recordId);
      fetchAndUpdateData();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const fetchAndUpdateData = () => {
    ApiService.fetchMerchandiseData(localStorage.getItem("accesToken"))
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchAndUpdateData();
  }, []);



  return (

    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

      </div>   <button
        className="text-green-500 hover:text-green-700 mr-2"
        onClick={openInsertForm}
      >
        <FontAwesomeIcon icon={faPlus} className="w-5 h-5" /> Add New
      </button>



      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Created on
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Updated on
            </th>

            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>  </tr>
        </thead>
        <tbody>  {isInsertFormOpen && (
          <tr>
            <td>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-300 rounded"
                placeholder="Name"
                name="name"
                value={newData.name}
                onChange={handleNewDataChange}
              />
            </td>
            <td>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-300 rounded"
                placeholder="price"
                name="price"
                value={newData.price}
                onChange={handleNewDataChange}
              />
            </td>
            <td></td>
            <td></td>
            <td>
              <button
                className="text-green-500 hover:text-green-700 mr-2"
                onClick={handleInsertSubmit}
              >
                <FontAwesomeIcon icon={faSave} className="w-5 h-5" /> Insert
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={closeInsertForm}
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" /> Cancel
              </button>
            </td>
          </tr>
        )}
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
                {editingId === item.id ? (
                  <input
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                {editingId === item.id ? (
                  <input
                    type="text"
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    value={editedData.price}
                    onChange={(e) => setEditedData({ ...editedData, price: e.target.value })}
                  />
                ) : (
                  item.price)}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss')}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                {format(new Date(item.updatedAt), 'yyyy-MM-dd HH:mm:ss')}

              </td> <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                {editingId === item.id ? (
                  <>
                    <button
                      className="text-green-500 hover:text-green-700 mr-2"
                      onClick={() => handleSaveClick(item.id)}
                    >
                      <FontAwesomeIcon icon={faSave} className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={handleCancelClick}
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleEditClick(item.id, item.name, item.price)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-5 h-5" /> Edit
                  </button>
                )}



                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 mr-2">
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}




        </tbody>
      </table>
    </div>
  );

};

export default Dashboard;
