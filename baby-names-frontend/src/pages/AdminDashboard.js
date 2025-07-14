 import React, { useState, useEffect } from "react";
import "../styles/PageLayout.css";
import "../styles/FormStyles.css";

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [reportStatus, setReportStatus] = useState("");
  const [backupStatus, setBackupStatus] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("⚠ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("dataset", file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setUploadStatus(res.ok ? `✅ ${result.message}` : `❌ ${result.message}`);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("❌ Upload failed due to a network error.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/report`);
      const data = await res.json();
      setReportStatus(`✅ Report generated: ${data.summary || "See backend logs"}`);
    } catch (err) {
      setReportStatus("❌ Report generation failed.");
    }
  };

  const handleBackup = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/backup`);
      const data = await res.json();
      setBackupStatus(`✅ Backup: ${data.message}`);
    } catch (err) {
      setBackupStatus("❌ Backup failed.");
    }
  };

  const handleRestore = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/restore`);
      const data = await res.json();
      setBackupStatus(`✅ Restore: ${data.message}`);
    } catch (err) {
      setBackupStatus("❌ Restore failed.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-header">Admin Dashboard</h2>
      <div className="page-content">
        {/* Upload Section */}
        <form onSubmit={handleUpload} className="form-container">
          <label>
            Upload Dataset (.csv or .json):
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="file-input"
            />
          </label>
          <button type="submit" className="upload-btn">Upload</button>
        </form>
        {uploadStatus && <p className="status-msg">{uploadStatus}</p>}

        {/* User Management */}
        <div className="admin-card">
          <h3>Registered Users</h3>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id}>{user.username} ({user.role})</li>
              ))}
            </ul>
          )}
        </div>

        {/* Report Generation */}
        <div className="admin-card">
          <h3>Generate Report</h3>
          <button onClick={handleGenerateReport} className="upload-btn">Generate</button>
          {reportStatus && <p className="status-msg">{reportStatus}</p>}
        </div>

        {/* Backup and Restore */}
        <div className="admin-card">
          <h3>Backup & Restore</h3>
          <button onClick={handleBackup} className="upload-btn">Backup Database</button>
          <button onClick={handleRestore} className="upload-btn">Restore Backup</button>
          {backupStatus && <p className="status-msg">{backupStatus}</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
