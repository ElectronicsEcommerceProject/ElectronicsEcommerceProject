
import React from 'react';

import {
  getApi,
  createApi,
  updateApiById,
  deleteApiById
} from '../../../src/api/api.js';
import MESSAGE from '../../../src/api/message.js';
import {
  adminNotificationRoute,
  adminNotificationAddRoute,
  adminNotificationLogsRoute,
  adminNotificationStatsRoute,
  adminNotificationTemplatesRoute,
  allCustomerRoute,
  allRetailerRoute,
} from '../../../src/index.js';

const NavBar = ({ activeTab, setActiveTab }) => (
  <nav className="flex items-center justify-between p-4 bg-white shadow-md">
    <div className="flex items-center space-x-2">
      <div className="text-blue-600 text-2xl">🔔</div>
      <span className="text-xl font-semibold text-gray-800">NotifyHub</span>
    </div>
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
      <button
        onClick={() => setActiveTab('send')}
        className={`flex items-center px-4 py-2 rounded-lg ${
          activeTab === 'send'
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <span className="mr-1">✈️</span> Send Notification
      </button>
      <button
        onClick={() => setActiveTab('templates')}
        className={`flex items-center px-4 py-2 rounded-lg ${
          activeTab === 'templates'
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <span className="mr-1">📋</span> Templates Manager
      </button>
      <button
        onClick={() => setActiveTab('logs')}
        className={`flex items-center px-4 py-2 rounded-lg ${
          activeTab === 'logs'
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <span className="mr-1">🔄</span> Notification Logs
      </button>
    </div>
  </nav>
);

const TemplateRow = ({ template, isHighlighted, onEdit, onDelete }) => (
  <tr className={`border-b ${isHighlighted ? 'bg-gray-100' : ''}`}>
    <td className="py-3 px-4">{template.name}</td>
    <td className="py-3 px-4 flex items-center">
      {template.type === 'Email' ? (
        <span className="flex items-center text-blue-600">
          <span className="mr-1">📧</span> Email
        </span>
      ) : template.type === 'SMS' ? (
        <span className="flex items-center text-gray-600">
          <span className="mr-1">📱</span> SMS
        </span>
      ) : (
        <span className="flex items-center text-purple-600">
          <span className="mr-1">📲</span> In app SMS
        </span>
      )}
    </td>
    <td className="py-3 px-4">{template.created}</td>
    <td className="py-3 px-4 flex space-x-2">
      <button
        onClick={() => onEdit(template)}
        className="text-blue-600 hover:text-blue-800"
        title="Edit Template"
      >
        ✏️
      </button>
      <button
        onClick={() => onDelete(template.id)}
        className="text-red-600 hover:text-red-800"
        title="Delete Template"
      >
        🗑️
      </button>
    </td>
  </tr>
);

const TemplateModal = ({ isOpen, onClose, template, onSave }) => {
  const [formData, setFormData] = React.useState({
    name: template?.name || '',
    type: template?.type || 'Email',
    content: template?.content || ''
  });

  React.useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        type: template.type || 'Email',
        content: template.content || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'Email',
        content: ''
      });
    }
  }, [template]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...template, ...formData });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">
          {template ? 'Edit Template' : 'New Template'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Template Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="In app SMS">In app SMS</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2 border rounded-lg h-32"
              placeholder="Enter template content..."
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {template ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TemplatesManager = () => {
  const [templates, setTemplates] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Fetch templates on component mount
  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await getApi(adminNotificationTemplatesRoute);
      if (response.success) {
        setTemplates(response.data?.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Keep empty array if API fails
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        setLoading(true);
        const response = await deleteApiById(adminNotificationTemplatesRoute, templateId);
        if (response.success) {
          setTemplates(templates.filter(t => t.id !== templateId));
          console.log('Template deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete template. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveTemplate = async (templateData) => {
    try {
      setLoading(true);
      if (editingTemplate) {
        // Update existing template
        const response = await updateApiById(
          adminNotificationTemplatesRoute,
          editingTemplate.id,
          templateData
        );
        if (response.success) {
          setTemplates(templates.map(t =>
            t.id === editingTemplate.id ? { ...response.data.template } : t
          ));
          console.log('Template updated successfully');
        }
      } else {
        // Create new template
        const response = await createApi(adminNotificationTemplatesRoute, templateData);
        if (response.success) {
          setTemplates([...templates, response.data.template]);
          console.log('Template created successfully');
        }
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Templates Manager</h1>
          <p className="text-gray-600">Create and manage reusable notification templates</p>
        </div>
        <button
          onClick={handleNewTemplate}
          className="mt-2 sm:mt-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 flex items-center"
        >
          <span className="mr-1">+</span> New Template
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600">📋 Name</th>
              <th className="py-3 px-4 text-left text-gray-600">🔤 Type</th>
              <th className="py-3 px-4 text-left text-gray-600">🗓️ Created</th>
              <th className="py-3 px-4 text-left text-gray-600">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, index) => (
              <TemplateRow
                key={template.id}
                template={template}
                isHighlighted={index === 0}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
              />
            ))}
          </tbody>
        </table>
      </div>

      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};

const CustomerRow = ({ name, email, isChecked, onCheckChange }) => (
  <div className="flex items-center py-2 border-b">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onCheckChange}
      className="mr-3"
    />
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-gray-600">{email}</p>
    </div>
  </div>
);

const SendNotification = () => {
  const [targetAudience, setTargetAudience] = React.useState('All Users');
  const [channel, setChannel] = React.useState('In app SMS');
  const [template, setTemplate] = React.useState('No Template');
  const [selectedCustomers, setSelectedCustomers] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [templates, setTemplates] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [retailers, setRetailers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Fetch templates on component mount
  React.useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch customers/retailers when target audience changes
  React.useEffect(() => {
    // Clear selected customers and search term when audience changes
    setSelectedCustomers([]);
    setSearchTerm('');

    if (targetAudience === 'Specific Customers') {
      fetchCustomers();
    } else if (targetAudience === 'Specific Retailers') {
      fetchRetailers();
    }
  }, [targetAudience]);

  const fetchTemplates = async () => {
    try {
      const response = await getApi(adminNotificationTemplatesRoute);
      if (response.success) {
        setTemplates(response.data?.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getApi(allCustomerRoute);
      if (response.success) {
        setCustomers(response.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };

  const fetchRetailers = async () => {
    try {
      const response = await getApi(allRetailerRoute);
      if (response.success) {
        setRetailers(response.retailers || []);
      }
    } catch (error) {
      console.error('Error fetching retailers:', error);
      setRetailers([]);
    }
  };

  const handleCustomerCheck = (userId) => {
    setSelectedCustomers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendNotification = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!title.trim()) {
        alert('Please enter a notification title');
        return;
      }
      if (!message.trim()) {
        alert('Please enter a notification message');
        return;
      }
      if (targetAudience.includes('Specific') && selectedCustomers.length === 0) {
        alert('Please select at least one recipient');
        return;
      }

      const notificationData = {
        targetAudience,
        channel,
        templateId: template !== 'No Template' ? template : null,
        title: title.trim(),
        message: message.trim(),
        specificUserIds: targetAudience.includes('Specific') ? selectedCustomers : null
      };

      const response = await createApi(adminNotificationAddRoute, notificationData);
      if (response.success) {
        alert('Notification sent successfully!');
        // Reset form
        setTitle('');
        setMessage('');
        setSelectedCustomers([]);
        setTemplate('No Template');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const getFilteredUsers = () => {
    const users = targetAudience === 'Specific Customers' ? customers : retailers;
    if (!searchTerm.trim()) return users;

    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Send Notification</h1>
        <p className="text-gray-600 mb-4">Reach your audience with targeted messages</p>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
            <div className="flex-1">
              <label className="flex items-center text-gray-600 mb-2">
                <span className="mr-1">👥</span> Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option>All Users</option>
                <option>All Customers</option>
                <option>All Retailers</option>
                <option>Specific Customers</option>
                <option>Specific Retailers</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="flex items-center text-gray-600 mb-2">
                <span className="mr-1">📡</span> Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option>Email</option>
                <option>SMS</option>
                <option>In app SMS</option>
              </select>
            </div>
          </div>
          {targetAudience.includes('Specific') && (
            <div className="mb-4">
              <label className="flex items-center text-gray-600 mb-2">
                <span className="mr-1">👤</span> Select {targetAudience === 'Specific Customers' ? 'Customers' : 'Retailers'}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${targetAudience === 'Specific Customers' ? 'customers' : 'retailers'}...`}
                className="w-full p-2 border rounded-lg mb-2"
              />
              <div className="max-h-40 overflow-y-auto">
                {loading ? (
                  <div className="py-4 text-center text-gray-500">
                    Loading {targetAudience === 'Specific Customers' ? 'customers' : 'retailers'}...
                  </div>
                ) : (
                  getFilteredUsers().map((user) => (
                    <CustomerRow
                      key={user.user_id}
                      name={user.name}
                      email={user.email}
                      isChecked={selectedCustomers.includes(user.user_id)}
                      onCheckChange={() => handleCustomerCheck(user.user_id)}
                    />
                  ))
                )}
              </div>
              {selectedCustomers.length === 0 && (
                <p className="text-red-600 mt-2">⚠️ Please select at least one recipient</p>
              )}
              <p className="text-gray-600 mt-2">{selectedCustomers.length} selected</p>
            </div>
          )}
          <div className="mb-4">
            <label className="flex items-center text-gray-600 mb-2">
              <span className="mr-1">📄</span> Template (Optional)
            </label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="No Template">No Template</option>
              {templates.map((temp) => (
                <option key={temp.id} value={temp.id}>
                  {temp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center text-gray-600 mb-2">
              <span className="mr-1">📌</span> Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title..."
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="flex items-center text-gray-600 mb-2">
              <span className="mr-1">📝</span> Message Content
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Craft your message here... ✨"
              className="w-full p-2 border rounded-lg h-32"
              required
            />
          </div>
          <button
            onClick={handleSendNotification}
            disabled={loading}
            className={`mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:from-purple-600 hover:to-indigo-700 w-full flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="mr-1">✈️</span>
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </div>

    </div>
  );
};

const LogRow = ({ log, onViewDetails }) => (
  <tr className="border-b">
    <td className="py-3 px-4">{log.date}</td>
    <td className="py-3 px-4">{log.sentBy}</td>
    <td className="py-3 px-4">{log.audience}</td>
    <td className="py-3 px-4 flex items-center">
      {log.channel === 'Email' ? (
        <span className="flex items-center text-blue-600">
          <span className="mr-1">📧</span> Email
        </span>
      ) : log.channel === 'SMS' ? (
        <span className="flex items-center text-gray-600">
          <span className="mr-1">📱</span> SMS
        </span>
      ) : (
        <span className="flex items-center text-purple-600">
          <span className="mr-1">📲</span> In app SMS
        </span>
      )}
    </td>
    <td className="py-3 px-4">
      <span
        className={`${
          log.status === 'Sent' ? 'text-green-600' : 'text-red-600'
        } flex items-center`}
      >
        <span className="mr-1">{log.status === 'Sent' ? '✅' : '❌'}</span> {log.status}
      </span>
    </td>
    <td className="py-3 px-4">
      <button
        onClick={() => onViewDetails(log)}
        className="text-blue-600 hover:text-blue-800"
      >
        👁️ View Details
      </button>
    </td>
  </tr>
);

const NotificationLogs = () => {
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [filters, setFilters] = React.useState({
    channel: 'All Channels',
    status: 'All Statuses',
    audience: 'All Audiences'
  });
  const [selectedDetailLog, setSelectedDetailLog] = React.useState(null);
  const [stats, setStats] = React.useState({
    total: 0,
    successful: 0,
    failed: 0,
    openRate: 0
  });

  // Fetch logs and stats on component mount and filter changes
  React.useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.channel !== 'All Channels') queryParams.append('channel', filters.channel);
      if (filters.status !== 'All Statuses') queryParams.append('status', filters.status);
      if (filters.audience !== 'All Audiences') queryParams.append('audience', filters.audience);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `${adminNotificationLogsRoute}?${queryString}` : adminNotificationLogsRoute;
      const response = await getApi(endpoint);

      if (response.success) {
        setLogs(response.data?.logs || []);
        // Also update stats from the logs response
        if (response.data?.stats) {
          setStats({
            total: response.data.stats.total || 0,
            successful: response.data.stats.successful || 0,
            failed: response.data.stats.failed || 0,
            openRate: response.data.stats.successRate || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.channel !== 'All Channels') queryParams.append('channel', filters.channel);
      if (filters.audience !== 'All Audiences') queryParams.append('audience', filters.audience);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `${adminNotificationStatsRoute}?${queryString}` : adminNotificationStatsRoute;
      const response = await getApi(endpoint);

      if (response.success && response.data?.stats) {
        setStats({
          total: response.data.stats.total || 0,
          successful: response.data.stats.successful || 0,
          failed: response.data.stats.failed || 0,
          openRate: response.data.stats.successRate || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ total: 0, successful: 0, failed: 0, openRate: 0 });
    }
  };

  // Since we're fetching filtered data from API, we use logs directly
  const filteredLogs = logs;

  const handleStatClick = (filterType) => {
    switch(filterType) {
      case 'total':
        setFilters({ ...filters, status: 'All Statuses' });
        break;
      case 'successful':
        setFilters({ ...filters, status: 'Sent' });
        break;
      case 'failed':
        setFilters({ ...filters, status: 'Failed' });
        break;
      default:
        break;
    }
  };

  const handleViewDetails = (log) => {
    setSelectedDetailLog(log);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Notification Logs</h1>
      <p className="text-gray-600 mb-4">Track and analyze your notification performance</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div
          onClick={() => handleStatClick('total')}
          className="bg-blue-500 text-white rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-blue-600 transition-colors"
        >
          <span>Total Sent</span>
          <span className="text-2xl">{stats.total}</span>
        </div>
        <div
          onClick={() => handleStatClick('successful')}
          className="bg-green-500 text-white rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-green-600 transition-colors"
        >
          <span>Successful</span>
          <span className="text-2xl">{stats.successful}</span>
        </div>
        <div
          onClick={() => handleStatClick('failed')}
          className="bg-red-500 text-white rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-red-600 transition-colors"
        >
          <span>Failed</span>
          <span className="text-2xl">{stats.failed}</span>
        </div>
        <div className="bg-purple-500 text-white rounded-lg p-4 flex items-center justify-between">
          <span>Success Rate</span>
          <span className="text-2xl">{stats.openRate}%</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label className="flex items-center text-gray-600 mb-2">
              <span className="mr-1">🔍</span> Channel Filter
            </label>
            <select
              value={filters.channel}
              onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option>All Channels</option>
              <option>Email</option>
              <option>SMS</option>
              <option>In app SMS</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="flex items-center text-gray-600 mb-2">
              <span className="mr-1">📊</span> Status Filter
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option>All Statuses</option>
              <option>Sent</option>
              <option>Failed</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="flex items-center text-gray-600 mb-2">
              <span className="mr-1">👥</span> Audience Filter
            </label>
            <select
              value={filters.audience}
              onChange={(e) => setFilters({ ...filters, audience: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option>All Audiences</option>
              <option>All Users</option>
              <option>All Customers</option>
              <option>All Retailers</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {loading ? 'Loading notifications...' : `Showing ${filteredLogs.length} notifications`}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600">📅 Date & Time</th>
              <th className="py-3 px-4 text-left text-gray-600">👤 Sent By</th>
              <th className="py-3 px-4 text-left text-gray-600">👥 Audience</th>
              <th className="py-3 px-4 text-left text-gray-600">📡 Channel</th>
              <th className="py-3 px-4 text-left text-gray-600">📊 Status</th>
              <th className="py-3 px-4 text-left text-gray-600">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                  Loading notifications...
                </td>
              </tr>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <LogRow
                  key={log.id}
                  log={log}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                  No notifications found matching the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedDetailLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Notification Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-600">Date & Time:</span>
                <p>{selectedDetailLog.date}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Sent By:</span>
                <p>{selectedDetailLog.sentBy}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Audience:</span>
                <p>{selectedDetailLog.audience}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Channel:</span>
                <p>{selectedDetailLog.channel}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Status:</span>
                <p className={selectedDetailLog.status === 'Sent' ? 'text-green-600' : 'text-red-600'}>
                  {selectedDetailLog.status}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Message:</span>
                <p className="bg-gray-50 p-2 rounded">{selectedDetailLog.message}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDetailLog(null)}
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationPage = () => {
  const [activeTab, setActiveTab] = React.useState('send');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'send' && <SendNotification />}
      {activeTab === 'templates' && <TemplatesManager />}
      {activeTab === 'logs' && <NotificationLogs />}
    </div>
  );
};

export default NotificationPage;
