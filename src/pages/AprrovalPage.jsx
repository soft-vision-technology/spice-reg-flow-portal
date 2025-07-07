import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AprrovalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [approval, setApproval] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState(null);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance
      .get(`/api/approval/get/${id}`)
      .then((res) => setApproval(res.data?.newRequest))
      .catch(() => setApproval(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (approval?.requestedUrl) {
      setCurrentLoading(true);
      axiosInstance
        .get(`/api/${approval.requestedUrl}`)
        .then((res) => setCurrentData(res.data))
        .catch(() => setCurrentData(null))
        .finally(() => setCurrentLoading(false));
    }
  }, [approval]);

  const handleApprove = async () => {
    if (!remarks.trim()) {
      alert("Remarks are required.");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Patch the requestedUrl with the requested data
      await axiosInstance.patch(`/api/${approval.requestedUrl}`, approval.requestData);
      // 2. Update approval status
      await axiosInstance.patch(`/api/approval/update/${id}`, {
        remarks,
        status: "approved",
      });
      alert("Request approved successfully.");
      navigate('/user-management')
    } catch (err) {
      alert("Failed to approve request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeny = async () => {
    if (!remarks.trim()) {
      alert("Remarks are required.");
      return;
    }
    setSubmitting(true);
    try {
      // Only update approval status, do not patch requestedUrl
      await axiosInstance.patch(`/api/approval/update/${id}`, {
        remarks,
        status: "denied",
      });
      alert("Request denied.");
      window.location.reload();
    } catch (err) {
      alert("Failed to deny request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading approval request...</div>;
  if (!approval) return <div>No approval request found.</div>;

  const requestData = approval.requestData || {};

  return (
    <div>
      <h2>Approval Request: {approval.requestName}</h2>
      <h4>Status: {approval.status}</h4>
      <div style={{ marginTop: 24 }}>
        <h3>Requested Changes</h3>
        <div style={{ display: "flex", gap: 32 }}>
          <div>
            <h4>Current Data</h4>
            {currentLoading && <div>Loading current data...</div>}
            {!currentLoading && currentData && (
              <table>
                <tbody>
                  {Object.keys(requestData).map((key) => (
                    <tr key={key}>
                      <td style={{ fontWeight: "bold", paddingRight: 8 }}>{key}</td>
                      <td>
                        {currentData[key] !== undefined
                          ? String(currentData[key])
                          : <span style={{ color: "#aaa" }}>N/A</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div>
            <h4>Requested Data</h4>
            <table>
              <tbody>
                {Object.entries(requestData).map(([key, value]) => (
                  <tr key={key}>
                    <td style={{ fontWeight: "bold", paddingRight: 8 }}>{key}</td>
                    <td>{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <label>
            Remarks <span style={{ color: "red" }}>*</span>
            <textarea
              style={{ width: "100%", minHeight: 60, marginTop: 8 }}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              disabled={submitting}
              required
            />
          </label>
          <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
            <button
              onClick={handleApprove}
              disabled={submitting}
              style={{
                background: "#16a34a",
                color: "#fff",
                padding: "8px 24px",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Approve
            </button>
            <button
              onClick={handleDeny}
              disabled={submitting}
              style={{
                background: "#dc2626",
                color: "#fff",
                padding: "8px 24px",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Deny
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AprrovalPage;