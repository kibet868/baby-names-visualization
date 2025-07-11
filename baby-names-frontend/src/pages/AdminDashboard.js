 // src/pages/AdminDashboard.js
import React, { useState } from "react";
import "../styles/PageLayout.css"; // ✅ shared layout
import "../styles/FormStyles.css"; // ✅ optional form styling if you have it

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(""); // reset status when a new file is chosen
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("dataset", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setUploadStatus(`✅ ${result.message}`);
      } else {
        setUploadStatus(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("❌ Upload failed due to a network error.");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-header">Admin Dashboard</h2>
      <div className="page-content">
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
          <button type="submit" className="upload-btn">
            Upload
          </button>
        </form>
        {uploadStatus && <p className="status-msg">{uploadStatus}</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;
