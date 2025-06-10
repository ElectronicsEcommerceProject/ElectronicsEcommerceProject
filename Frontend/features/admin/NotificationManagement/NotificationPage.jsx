
import React from 'react';

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
  const [templates, setTemplates] = React.useState([
    { id: 1, name: "Welcome Email", type: "Email", created: "4/15/2025", content: "Welcome to our platform!" },
    { id: 2, name: "Order Confirmation", type: "SMS", created: "4/10/2025", content: "Your order has been confirmed." },
    { id: 3, name: "Password Reset", type: "Email", created: "4/8/2025", content: "Click here to reset your password." }
  ]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState(null);

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
    }
  };

  const handleSaveTemplate = (templateData) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(t =>
        t.id === editingTemplate.id ? { ...templateData, id: editingTemplate.id } : t
      ));
    } else {
      // Create new template
      const newTemplate = {
        ...templateData,
        id: Math.max(...templates.map(t => t.id)) + 1,
        created: new Date().toLocaleDateString()
      };
      setTemplates([...templates, newTemplate]);
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
  const [channel, setChannel] = React.useState('Email');
  const [template, setTemplate] = React.useState('No Template');
  const [selectedCustomers, setSelectedCustomers] = React.useState([]);

  const customers = [
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
    { name: "Robert Johnson", email: "robert.johnson@example.com" },
    { name: "Emily Davis", email: "emily.davis@example.com" },
  ];

  const handleCustomerCheck = (email) => {
    setSelectedCustomers((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
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
                <span className="mr-1">👤</span> Select Customers
              </label>
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full p-2 border rounded-lg mb-2"
              />
              <div className="max-h-40 overflow-y-auto">
                {customers.map((customer) => (
                  <CustomerRow
                    key={customer.email}
                    name={customer.name}
                    email={customer.email}
                    isChecked={selectedCustomers.includes(customer.email)}
                    onCheckChange={() => handleCustomerCheck(customer.email)}
                  />
                ))}
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
              <option>No Template</option>
              <option>Welcome Email</option>
              <option>Order Confirmation</option>
              <option>Password Reset</option>
            </select>
          </div>
          <div>
            <label className="flex items-center text-gray-600 mb-2">
              <span className="mr-1">📝</span> Message Content
            </label>
            <textarea
              placeholder="Craft your message here... ✨"
              className="w-full p-2 border rounded-lg h-32"
            ></textarea>
            
          </div>
          <button className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:from-purple-600 hover:to-indigo-700 w-full flex items-center justify-center">
            <span className="mr-1">✈️</span> Send Notification
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
  const [logs, setLogs] = React.useState([
    { id: 1, date: "5/1/2025 3:30:00 PM", sentBy: "admin1", audience: "All Users", channel: "Email", status: "Sent", message: "Welcome to our platform!" },
    { id: 2, date: "4/30/2025 8:00:00 PM", sentBy: "admin2", audience: "All Retailers", channel: "SMS", status: "Failed", message: "System maintenance notification" },
    { id: 3, date: "4/29/2025 2:45:00 PM", sentBy: "admin1", audience: "All Customers", channel: "Email", status: "Sent", message: "New product announcement" },
    { id: 4, date: "4/28/2025 9:50:00 PM", sentBy: "admin1", audience: "John Doe, Jane Smith", channel: "Email", status: "Sent", message: "Order confirmation" },
    { id: 5, date: "4/27/2025 5:15:00 PM", sentBy: "admin2", audience: "SuperMart, MegaStore", channel: "SMS", status: "Sent", message: "Inventory update" },
    { id: 6, date: "4/26/2025 1:20:00 PM", sentBy: "admin1", audience: "All Users", channel: "In app SMS", status: "Sent", message: "App update available" },
    { id: 7, date: "4/25/2025 11:30:00 AM", sentBy: "admin2", audience: "All Customers", channel: "Email", status: "Failed", message: "Newsletter" }
  ]);

  const [filters, setFilters] = React.useState({
    channel: 'All Channels',
    status: 'All Statuses',
    audience: 'All Audiences'
  });

  const [selectedDetailLog, setSelectedDetailLog] = React.useState(null);

  // Filter logs based on current filters
  const filteredLogs = logs.filter(log => {
    const channelMatch = filters.channel === 'All Channels' || log.channel === filters.channel;
    const statusMatch = filters.status === 'All Statuses' || log.status === filters.status;
    const audienceMatch = filters.audience === 'All Audiences' ||
      (filters.audience === 'All Users' && log.audience === 'All Users') ||
      (filters.audience === 'All Customers' && log.audience === 'All Customers') ||
      (filters.audience === 'All Retailers' && log.audience === 'All Retailers');

    return channelMatch && statusMatch && audienceMatch;
  });

  // Calculate stats from filtered logs
  const stats = {
    total: filteredLogs.length,
    successful: filteredLogs.filter(log => log.status === 'Sent').length,
    failed: filteredLogs.filter(log => log.status === 'Failed').length,
    openRate: filteredLogs.length > 0 ? Math.round((filteredLogs.filter(log => log.status === 'Sent').length / filteredLogs.length) * 100) : 0
  };

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
          Showing {filteredLogs.length} of {logs.length} notifications
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
            {filteredLogs.length > 0 ? (
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
