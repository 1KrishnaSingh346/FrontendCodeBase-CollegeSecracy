import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore';

const AdminPlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    title: '',
    tag: '',
    description: '',
    price: '',
    sessions: '',
    features: [],
    highlight: false,
    Plantype: 'counselling',
    expiryDate: new Date().toISOString().split('T')[0]
  });
  const [editingPlan, setEditingPlan] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { AddPlan, GetPlan, UpdatePlan, DeletePlan, user } = useAuthStore();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const plans = await GetPlan();
      setPlans(plans || []);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      if (editingPlan) {
        setEditingPlan(prev => ({
          ...prev,
          features: [...prev.features, featureInput.trim()]
        }));
      } else {
        setNewPlan(prev => ({
          ...prev,
          features: [...prev.features, featureInput.trim()]
        }));
      }
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    if (editingPlan) {
      setEditingPlan(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    } else {
      setNewPlan(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const handleCreatePlan = async () => {
    try {
      const planToCreate = {
        title: newPlan.title,
        description: newPlan.description,
        price: newPlan.price,
        Plantype: newPlan.Plantype
      };
      if(newPlan.Plantype === 'tool')
      {
        planToCreate.link = newPlan.link;
      }

      // Only add counselling-specific fields if plan type is counselling
      if (newPlan.Plantype === 'counselling') {
        planToCreate.tag = newPlan.tag;
        planToCreate.sessions = newPlan.sessions;
        planToCreate.features = newPlan.features;
        planToCreate.highlight = newPlan.highlight;
        planToCreate.expiryDate = new Date(newPlan.expiryDate);
      }

      await AddPlan(planToCreate);
      fetchPlans();
      setIsAdding(false);
      setNewPlan({
        title: '',
        tag: '',
        description: '',
        price: '',
        sessions: '',
        features: [],
        highlight: false,
        Plantype: 'counselling',
        expiryDate: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  const handleUpdatePlan = async () => {
    try {
      const planToUpdate = {
        title: editingPlan.title,
        description: editingPlan.description,
        price: editingPlan.price,
        Plantype: editingPlan.Plantype
      };

      if(editingPlan.Plantype === 'tool')
      {
        planToUpdate.link = editingPlan.link;
      }

      // Only add counselling-specific fields if plan type is counselling
      if (editingPlan.Plantype === 'counselling') {
        planToUpdate.tag = editingPlan.tag;
        planToUpdate.sessions = editingPlan.sessions;
        planToUpdate.features = editingPlan.features;
        planToUpdate.highlight = editingPlan.highlight;
        planToUpdate.expiryDate = new Date(editingPlan.expiryDate);
      }

      await UpdatePlan(editingPlan._id, planToUpdate);
      fetchPlans();
      setEditingPlan(null);
    } catch (err) {
      console.error('Failed to update plan:', err);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await DeletePlan(planId);
      fetchPlans();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  const handlePlanTypeChange = (type) => {
    setNewPlan(prev => ({
      ...prev,
      Plantype: type,
      // Reset counselling-specific fields when switching to tool
      ...(type === 'tool' && {
        tag: '',
        sessions: '',
        features: [],
        highlight: false,
        expiryDate: ''
      })
    }));
  };

  const handleEditPlanTypeChange = (type) => {
    setEditingPlan(prev => ({
      ...prev,
      Plantype: type,
      // Reset counselling-specific fields when switching to tool
      ...(type === 'tool' && {
        tag: '',
        sessions: '',
        features: [],
        highlight: false,
        expiryDate: ''
      })
    }));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold">Plan Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center w-full sm:w-auto justify-center"
        >
          <FiPlus className="mr-2" /> Add New Plan
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium text-lg mb-4">Add New Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title*</label>
              <input
                type="text"
                value={newPlan.title}
                onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Plan Type*</label>
              <select
                value={newPlan.Plantype}
                onChange={(e) => handlePlanTypeChange(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="counselling">Counselling</option>
                <option value="tool">Tool</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price*</label>
              <input
                type="text"
                value={newPlan.price}
                onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {newPlan.Plantype === 'counselling' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Tag</label>
                  <input
                    type="text"
                    value={newPlan.tag}
                    onChange={(e) => setNewPlan({...newPlan, tag: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sessions</label>
                  <input
                    type="text"
                    value={newPlan.sessions}
                    onChange={(e) => setNewPlan({...newPlan, sessions: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date*</label>
                  <input
                    type="date"
                    value={newPlan.expiryDate}
                    onChange={(e) => setNewPlan({...newPlan, expiryDate: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newPlan.highlight}
                    onChange={(e) => setNewPlan({...newPlan, highlight: e.target.checked})}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="block text-sm font-medium">Highlight</label>
                </div>
              </>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newPlan.description}
                onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Link or Url</label>
              <textarea
                value={newPlan.link}
                onChange={(e) => setNewPlan({...newPlan, link: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
          </div>
          
          {newPlan.Plantype === 'counselling' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Features</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                />
                <button
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm">{feature}</span>
                    <button
                      onClick={() => handleRemoveFeature(index)}
                      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePlan}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FiSave className="mr-2" /> Save Plan
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Expiry Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Highlight</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plans.map((plan) => (
              <tr key={plan._id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="font-medium">{plan.title}</div>
                  {plan.tag && (
                    <div className="text-sm text-gray-500">{plan.tag}</div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    plan.Plantype === 'counselling' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {plan.Plantype}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{plan.price}</td>
                <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                  {plan.Plantype === 'counselling' && plan.expiryDate ? new Date(plan.expiryDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                  {plan.Plantype === 'counselling' ? (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      plan.highlight ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.highlight ? 'Yes' : 'No'}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">N/A</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingPlan({
                        ...plan,
                        expiryDate: plan.Plantype === 'counselling' && plan.expiryDate ? 
                          new Date(plan.expiryDate).toISOString().split('T')[0] : ''
                      })}
                      className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                      aria-label="Edit"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(plan._id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                      aria-label="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Edit Plan</h3>
              <button 
                onClick={() => setEditingPlan(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title*</label>
                <input
                  type="text"
                  value={editingPlan.title}
                  onChange={(e) => setEditingPlan({...editingPlan, title: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Plan Type*</label>
                <select
                  value={editingPlan.Plantype}
                  onChange={(e) => handleEditPlanTypeChange(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="counselling">Counselling</option>
                  <option value="tool">Tool</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price*</label>
                <input
                  type="text"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({...editingPlan, price: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {editingPlan.Plantype === 'counselling' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tag</label>
                    <input
                      type="text"
                      value={editingPlan.tag || ''}
                      onChange={(e) => setEditingPlan({...editingPlan, tag: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sessions</label>
                    <input
                      type="text"
                      value={editingPlan.sessions || ''}
                      onChange={(e) => setEditingPlan({...editingPlan, sessions: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date*</label>
                    <input
                      type="date"
                      value={editingPlan.expiryDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEditingPlan({...editingPlan, expiryDate: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={editingPlan.Plantype === 'counselling'}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingPlan.highlight || false}
                      onChange={(e) => setEditingPlan({...editingPlan, highlight: e.target.checked})}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="block text-sm font-medium">Highlight</label>
                  </div>
                </>
              )}
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Link or Url</label>
                <textarea
                  value={editingPlan.link}
                  onChange={(e) => setEditingPlan({...editingPlan, link: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>
            </div>
            
            {editingPlan.Plantype === 'counselling' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Features</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingPlan.features?.map((feature, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-sm">{feature}</span>
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePlan}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FiSave className="mr-2" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="font-medium text-lg mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this plan? This action cannot be undone.</p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePlan(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlanManagement;