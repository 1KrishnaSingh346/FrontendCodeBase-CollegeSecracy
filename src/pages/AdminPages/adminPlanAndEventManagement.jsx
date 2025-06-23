import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { 
  FiCalendar, FiEdit, FiTrash2, FiPlus, FiSave, 
  FiX, FiUsers, FiClock, FiMapPin, FiLink, FiImage 
} from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore';
import AdminPlanManagement from '../AdminPages/AdminPaymentManagement';

const AdminPlanAndEventManagement = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    type: 'workshop',
    maxAttendees: '',
    registrationLink: '',
    imageUrl: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { 
    user, 
    fetchEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    getEventAttendees
  } = useAuthStore();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const handleCreateEvent = async () => {
    try {
      // Convert dates to ISO strings
      const eventToCreate = {
        ...newEvent,
        date: new Date(newEvent.date).toISOString(),
        endDate: new Date(newEvent.endDate).toISOString()
      };

      const createdEvent = await createEvent(eventToCreate);
      if (createdEvent) {
        await loadEvents();
        setIsAdding(false);
        setNewEvent({
          title: '',
          description: '',
          date: '',
          endDate: '',
          location: '',
          type: 'workshop',
          maxAttendees: '',
          registrationLink: '',
          imageUrl: ''
        });
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      // Convert dates to ISO strings
      const eventToUpdate = {
        ...editingEvent,
        date: new Date(editingEvent.date).toISOString(),
        endDate: new Date(editingEvent.endDate).toISOString()
      };

      const updatedEvent = await updateEvent(editingEvent._id, eventToUpdate);
      if (updatedEvent) {
        await loadEvents();
        setEditingEvent(null);
      }
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const deletedEventId = await deleteEvent(eventId);
      if (deletedEventId) {
        await loadEvents();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleViewAttendees = async (eventId) => {
    try {
      const attendees = await getEventAttendees(eventId);
      // Here you would handle displaying the attendees
      // For example, you could show them in a modal
      console.log('Attendees:', attendees);
      alert(`Viewing attendees for event ${eventId}`);
    } catch (err) {
      console.error('Failed to fetch attendees:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getEventStatus = (start, end) => {
    const now = new Date();
    if (now < new Date(start)) return 'Upcoming';
    if (now > new Date(end)) return 'Completed';
    return 'Ongoing';
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList className="flex border-b border-gray-200">
          <Tab className="px-4 py-2 font-medium cursor-pointer focus:outline-none" selectedClassName="border-b-2 border-blue-500 text-blue-600">
            Plans
          </Tab>
          <Tab className="px-4 py-2 font-medium cursor-pointer focus:outline-none" selectedClassName="border-b-2 border-blue-500 text-blue-600">
            Events
          </Tab>
        </TabList>

        <TabPanel>
          <AdminPlanManagement />
        </TabPanel>

        <TabPanel>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold">Event Management</h2>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center w-full sm:w-auto justify-center"
            >
              <FiPlus className="mr-2" /> Add New Event
            </button>
          </div>

          {isAdding && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium text-lg mb-4">Add New Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Title*</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description*</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date & Time*</label>
                  <input
                    type="datetime-local"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date & Time*</label>
                  <input
                    type="datetime-local"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location*</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type*</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="seminar">Seminar</option>
                    <option value="meetup">Meetup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Attendees</label>
                  <input
                    type="number"
                    min="1"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({...newEvent, maxAttendees: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Link</label>
                  <input
                    type="url"
                    value={newEvent.registrationLink}
                    onChange={(e) => setNewEvent({...newEvent, registrationLink: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newEvent.imageUrl}
                    onChange={(e) => setNewEvent({...newEvent, imageUrl: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FiSave className="mr-2" /> Create Event
                </button>
              </div>
            </div>
          )}

          {editingEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Edit Event</h3>
                  <button 
                    onClick={() => setEditingEvent(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Title*</label>
                    <input
                      type="text"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description*</label>
                    <textarea
                      value={editingEvent.description}
                      onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date & Time*</label>
                    <input
                      type="datetime-local"
                      value={editingEvent.date}
                      onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date & Time*</label>
                    <input
                      type="datetime-local"
                      value={editingEvent.endDate}
                      onChange={(e) => setEditingEvent({...editingEvent, endDate: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location*</label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type*</label>
                    <select
                      value={editingEvent.type}
                      onChange={(e) => setEditingEvent({...editingEvent, type: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="workshop">Workshop</option>
                      <option value="webinar">Webinar</option>
                      <option value="seminar">Seminar</option>
                      <option value="meetup">Meetup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Attendees</label>
                    <input
                      type="number"
                      min="1"
                      value={editingEvent.maxAttendees}
                      onChange={(e) => setEditingEvent({...editingEvent, maxAttendees: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Registration Link</label>
                    <input
                      type="url"
                      value={editingEvent.registrationLink}
                      onChange={(e) => setEditingEvent({...editingEvent, registrationLink: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <input
                      type="url"
                      value={editingEvent.imageUrl}
                      onChange={(e) => setEditingEvent({...editingEvent, imageUrl: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateEvent}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <FiSave className="mr-2" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">{formatDate(event.date)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        getEventStatus(event.date, event.endDate) === 'Upcoming' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : getEventStatus(event.date, event.endDate) === 'Ongoing'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getEventStatus(event.date, event.endDate)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingEvent({
                            ...event,
                            date: new Date(event.date).toISOString().slice(0, 16),
                            endDate: new Date(event.endDate).toISOString().slice(0, 16)
                          })}
                          className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                          aria-label="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                          aria-label="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                        <button
                          onClick={() => handleViewAttendees(event._id)}
                          className="text-purple-600 hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1"
                          aria-label="View Attendees"
                        >
                          <FiUsers size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AdminPlanAndEventManagement;