import React, { useState } from 'react';

const NotificationPage = () => {
  // State for active tab
  const [activeSection, setActiveSection] = useState('send');

  // Mock data for templates
  const [templates, setTemplates] = useState([
    { id: 1, name: "Welcome Email", type: "Email", createdDate: "2025-04-15", content: "Hello {user_name}, welcome to our platform!" },
    { id: 2, name: "Order Confirmation", type: "SMS", createdDate: "2025-04-10", content: "Order {order_id} confirmed!" },
  ]);

  // Mock data for logs
  const [logs, setLogs] = useState([
    { id: 1, date: "2025-05-01 10:00", sentBy: "Admin John", audience: "All Users", channel: "Email", status: "Sent", openRate: "65%", clickRate: "20%", content: "Promotion alert!" },
    { id: 2, date: "2025-04-30 14:30", sentBy: "Admin Jane", audience: "Retailers", channel: "SMS", status: "Failed", openRate: "N/A", clickRate: "N/A", content: "Stock update" },
  ]);

  // Navigation component
  const TopNav = () => {
    const navItems = [
      { id: 'send', label: '📤 Send Notification' },
      { id: 'templates', label: '🧾 Templates Manager' },
      { id: 'logs', label: '📑 Notification Logs' },
    ];

    return (
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeSection === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  };

  // Send Notification Component
  const SendNotification = () => {
    const [formData, setFormData] = useState({
      audience: 'all',
      channel: 'email',
      message: '',
      schedule: 'now'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      alert(`Notification sent via ${formData.channel} to ${formData.audience}`);
      
      // Add to logs
      const newLog = {
        id: logs.length + 1,
        date: new Date().toLocaleString(),
        sentBy: "Current User",
        audience: formData.audience,
        channel: formData.channel,
        status: "Sent",
        openRate: "0%",
        clickRate: "0%",
        content: formData.message
      };
      
      setLogs([newLog, ...logs]);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Send Notification</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
            <select
              className="w-full p-2 border rounded-md"
              value={formData.audience}
              onChange={(e) => setFormData({...formData, audience: e.target.value})}
            >
              <option value="all">All Users</option>
              <option value="customer">Customers</option>
              <option value="retailer">Retailers</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
            <select
              className="w-full p-2 border rounded-md"
              value={formData.channel}
              onChange={(e) => setFormData({...formData, channel: e.target.value})}
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="inapp">In-App</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Type your message here..."
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Notification
          </button>
        </form>
      </div>
    );
  };

  // Templates Manager Component
  const TemplatesManager = () => {
    const [showForm, setShowForm] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ 
      name: "", 
      type: "Email", 
      content: "" 
    });
    const [previewTemplate, setPreviewTemplate] = useState(null);

    const handleAddTemplate = (e) => {
      e.preventDefault();
      const templateToAdd = {
        ...newTemplate,
        id: templates.length + 1,
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      setTemplates([...templates, templateToAdd]);
      setShowForm(false);
      setNewTemplate({ name: "", type: "Email", content: "" });
    };

    const handlePreview = (template) => {
      const previewContent = template.content
        .replace("{user_name}", "John Doe")
        .replace("{order_id}", "12345");
      setPreviewTemplate({ ...template, content: previewContent });
    };

    const deleteTemplate = (id) => {
      if (window.confirm("Are you sure you want to delete this template?")) {
        setTemplates(templates.filter(t => t.id !== id));
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Templates Manager</h1>
        
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-700 transition"
          onClick={() => setShowForm(true)}
        >
          Add New Template
        </button>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <form onSubmit={handleAddTemplate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  className="w-full p-2 border rounded-md"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newTemplate.type}
                  onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})}
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="In-App">In-App</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={5}
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                  placeholder="Use {user_name}, {order_id} as variables"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save Template
              </button>
              
              <button
                type="button"
                className="ml-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="p-4">{template.name}</td>
                  <td className="p-4">{template.type}</td>
                  <td className="p-4">{template.createdDate}</td>
                  <td className="p-4">
                    <button 
                      className="text-blue-600 mr-2 hover:underline"
                      onClick={() => {
                        setNewTemplate({
                          name: template.name,
                          type: template.type,
                          content: template.content
                        });
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 mr-2 hover:underline"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      Delete
                    </button>
                    <button 
                      className="text-purple-600 hover:underline"
                      onClick={() => handlePreview(template)}
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">{previewTemplate.name} Preview</h2>
              <div className="p-4 border rounded bg-gray-50">
                {previewTemplate.content}
              </div>
              <button
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Notification Logs Component
  const NotificationLogs = () => {
    const [selectedLog, setSelectedLog] = useState(null);
    const [filters, setFilters] = useState({
      channel: '',
      status: ''
    });

    const filteredLogs = logs.filter(log => {
      return (
        (filters.channel === '' || log.channel.toLowerCase().includes(filters.channel.toLowerCase())) &&
        (filters.status === '' || log.status.toLowerCase().includes(filters.status.toLowerCase()))
      );
    });

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notification Logs</h1>
        
        <div className="mb-4 flex space-x-4">
          <select
            className="p-2 border rounded-md"
            value={filters.channel}
            onChange={(e) => setFilters({...filters, channel: e.target.value})}
          >
            <option value="">All Channels</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          
          <select
            className="p-2 border rounded-md"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Sent By</th>
                <th className="p-4 text-left">Channel</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-4">{log.date}</td>
                  <td className="p-4">{log.sentBy}</td>
                  <td className="p-4">{log.channel}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      log.status === 'Sent' ? 'bg-green-100 text-green-800' : 
                      log.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedLog(log)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Notification Details</h2>
              
              <div className="space-y-3">
                <p><strong>Date:</strong> {selectedLog.date}</p>
                <p><strong>Sent By:</strong> {selectedLog.sentBy}</p>
                <p><strong>Channel:</strong> {selectedLog.channel}</p>
                <p><strong>Status:</strong> {selectedLog.status}</p>
                <p><strong>Audience:</strong> {selectedLog.audience}</p>
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="font-medium">Content:</p>
                  <p>{selectedLog.content}</p>
                </div>
              </div>
              
              <button
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                onClick={() => setSelectedLog(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main render
  return (
    <div className="bg-gray-100 min-h-screen">
      <TopNav />
      
      <main>
        {activeSection === 'send' && <SendNotification />}
        {activeSection === 'templates' && <TemplatesManager />}
        {activeSection === 'logs' && <NotificationLogs />}
      </main>
    </div>
  );
};

export default NotificationPage;