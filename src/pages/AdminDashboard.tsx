import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import * as XLSX from 'xlsx';
import { FiInfo, FiDownload, FiUsers, FiEye, FiImage, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  // Mock data for website traffic
  const [trafficData, setTrafficData] = useState([
    { date: '25-09-01', visitors: 1, pageViews: 2, bounceRate: 0, conversions: 0 },
    { date: '25-08-01', visitors: 156, pageViews: 342, bounceRate: 28, conversions: 12 },
    { date: '25-07-01', visitors: 98, pageViews: 201, bounceRate: 41, conversions: 5 },
    { date: '25-06-01', visitors: 187, pageViews: 421, bounceRate: 24, conversions: 15 },
    { date: '25-05-01', visitors: 213, pageViews: 498, bounceRate: 22, conversions: 18 },
    { date: '25-04-01', visitors: 145, pageViews: 321, bounceRate: 35, conversions: 9 },
  ]);

  // Mock data for service popularity
  const [serviceData, setServiceData] = useState([
    { name: 'Brand Strategy', leads: 42 },
    { name: 'Web Design', leads: 38 },
    { name: 'Social Media', leads: 56 },
    { name: 'Content Marketing', leads: 29 },
    { name: 'SEO Services', leads: 34 },
  ]);

  // Mock data for image uploads
  const [imageData, setImageData] = useState([
    { month: 'Jan', uploads: 124, approved: 98, rejected: 26 },
    { month: 'Feb', uploads: 156, approved: 132, rejected: 24 },
    { month: 'Mar', uploads: 187, approved: 158, rejected: 29 },
    { month: 'Apr', uploads: 213, approved: 187, rejected: 26 },
    { month: 'May', uploads: 198, approved: 172, rejected: 26 },
    { month: 'Jun', uploads: 234, approved: 201, rejected: 33 },
  ]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

  // Export to Excel
  const exportToExcel = () => {
    // const worksheet1 = XLSX.utils.json_to_sheet(trafficData);
    // const worksheet2 = XLSX.utils.json_to_sheet(serviceData);
    // const worksheet3 = XLSX.utils.json_to_sheet(imageData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet1, "WebsiteTraffic");
    // XLSX.utils.book_append_sheet(workbook, worksheet2, "ServiceLeads");
    // XLSX.utils.book_append_sheet(workbook, worksheet3, "ImageUploads");
    // XLSX.writeFile(workbook, "Korporate_Dashboard_Data.xlsx");
  };

  // Calculate totals
  const totalVisitors = trafficData.reduce((sum, day) => sum + day.visitors, 0);
  const totalPageViews = trafficData.reduce((sum, day) => sum + day.pageViews, 0);
  const totalConversions = trafficData.reduce((sum, day) => sum + day.conversions, 0);
  const totalImageUploads = imageData.reduce((sum, month) => sum + month.uploads, 0);
  const totalLeads = serviceData.reduce((sum, service) => sum + service.leads, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiDownload /> Export to Excel
          </button>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Track your marketing performance and brand engagement metrics. Monitor website traffic, 
              lead generation, and content performance to optimize your marketing strategies.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="text-blue-500" />
              <h3 className="text-gray-500 text-sm">Total Visitors</h3>
            </div>
            <p className="text-2xl font-bold">{totalVisitors.toLocaleString()}</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <FiEye className="text-green-500" />
              <h3 className="text-gray-500 text-sm">Page Views</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{totalPageViews.toLocaleString()}</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="text-purple-500" />
              <h3 className="text-gray-500 text-sm">Conversions</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{totalConversions}</p>
            <p className="text-sm text-gray-500">Lead forms submitted</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
            <div className="flex items-center gap-2 mb-2">
              <FiImage className="text-orange-500" />
              <h3 className="text-gray-500 text-sm">Image Uploads</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">{totalImageUploads}</p>
            <p className="text-sm text-gray-500">This year</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="text-red-500" />
              <h3 className="text-gray-500 text-sm">Total Leads</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">{totalLeads}</p>
            <p className="text-sm text-gray-500">By service category</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Website Traffic Over Time */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Website Traffic This Week</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visitors" fill="#0088FE" name="Visitors" />
                  <Bar dataKey="pageViews" fill="#00C49F" name="Page Views" />
                  <Bar dataKey="conversions" fill="#FF8042" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Popularity */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Leads by Service Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="leads"
                    nameKey="name"
                    label={({ name }) => `${name}`}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} leads`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Image Upload Statistics */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Image Upload Statistics 2024</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={imageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uploads" stroke="#0088FE" name="Total Uploads" strokeWidth={2} />
                <Line type="monotone" dataKey="approved" stroke="#00C49F" name="Approved" strokeWidth={2} />
                <Line type="monotone" dataKey="rejected" stroke="#FF8042" name="Rejected" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Average Bounce Rate</h3>
              <p className="text-xl font-bold">30.3%</p>
              <p className="text-sm text-green-600">↓ 2.4% from last month</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Conversion Rate</h3>
              <p className="text-xl font-bold">8.7%</p>
              <p className="text-sm text-green-600">↑ 1.2% from last month</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Most Popular Service</h3>
              <p className="text-xl font-bold">Social Media (56 leads)</p>
              <p className="text-sm text-gray-500">32% of total leads</p>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Performing Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,243</div>
              <div className="text-sm text-gray-600">Blog: Brand Strategy Tips</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">987</div>
              <div className="text-sm text-gray-600">Case Study: Client Success</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1,542</div>
              <div className="text-sm text-gray-600">Web Design Portfolio</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">876</div>
              <div className="text-sm text-gray-600">Social Media Campaign</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;