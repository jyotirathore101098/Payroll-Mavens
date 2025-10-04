import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const fetchReports = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/reports`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch reports');
  }
};

export const fetchLeaves = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/leaves`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching leaves:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch leaves data');
  }
};

export const fetchSalaryAdjustments = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/salary-adjustments`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching salary adjustments:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch salary adjustments data');
  }
};

export const downloadReport = async (endpoint, fileName) => {
  try {
    // Handle different endpoint formats
    let fullUrl;
    if (endpoint.startsWith('http')) {
      fullUrl = endpoint;
    } else if (endpoint.startsWith('/')) {
      fullUrl = `http://localhost:3000${endpoint}`;
    } else {
      fullUrl = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    }
    
    console.log('Downloading from URL:', fullUrl);
    
    const res = await axios.get(fullUrl, {
      headers: getAuthHeaders(),
      responseType: "blob",
      timeout: 30000, // 30 second timeout
    });
    
    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading report:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Download timeout - please try again');
    }
    throw new Error(error.response?.data?.message || error.message || 'Failed to download report');
  }
};

// Direct report downloads using correct endpoints
export const downloadLeavesReport = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/reports/leaves`, {
      headers: getAuthHeaders(),
      responseType: "blob",
    });
    
    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", "leaves_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading leaves report:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to download leaves report');
  }
};

export const downloadSalaryAdjustmentsReport = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/reports/adjustments`, {
      headers: getAuthHeaders(),
      responseType: "blob",
    });
    
    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", "salary_adjustments_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading salary adjustments report:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to download salary adjustments report');
  }
};

export const downloadComplianceReport = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/reports/compliance/csv?month=Sep-2025`, {
      headers: getAuthHeaders(),
      responseType: "blob",
    });
    
    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", "compliance_report_Sep-2025.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading compliance report:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to download compliance report');
  }
};
