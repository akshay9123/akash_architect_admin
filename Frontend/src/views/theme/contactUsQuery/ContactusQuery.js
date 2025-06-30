import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormSelect,
  CRow,
  CCol,
} from "@coreui/react";

import axios from "axios";
import { toast } from "react-toastify";
import { FaComments } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap icons

const ContactUs = () => {
  const [filter, setFilter] = useState("all");
  const [queries, setQueries] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!BASE_URL) {
          console.error("BASE_URL is not defined");
          return;
        }

        const res = await axios.get(`${BASE_URL}contact/get/query`, {
          withCredentials: true,
        });

        const sorted = res.data.querys.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setQueries(sorted);
      } catch (err) {
        console.error("Failed to fetch queries:", err);
        toast.error("Failed to load contact queries");
      }
    };

    fetchData();
  }, [BASE_URL]);

  const handleStatusChange = async (id, newStatus, index) => {
    try {
      await axios.put(
        `${BASE_URL}contact/update/status/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      const updatedQueries = [...queries];
      updatedQueries[index].status = newStatus;
      setQueries(updatedQueries);

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;

    try {
      await axios.delete(`${BASE_URL}contact/delete/${id}`, {
        withCredentials: true,
      });

      setQueries((prev) => prev.filter((q) => q._id !== id));
      toast.success("Query deleted successfully");
    } catch (err) {
      console.error("Failed to delete query:", err);
      toast.error("Failed to delete query");
    }
  };

  const filteredQueries = queries.filter((item) =>
    filter === "all" ? true : item.status === filter
  );

  const renderTable = () => (
    <div className="table-responsive-md">
  <CTable hover striped className="text-center align-middle w-100">
    <CTableHead color="light">
      <CTableRow>
        <CTableHeaderCell style={{ width: "50px" }}>#</CTableHeaderCell>
        <CTableHeaderCell style={{ minWidth: "160px" }}>Name</CTableHeaderCell>
        <CTableHeaderCell style={{ minWidth: "200px" }}>Email</CTableHeaderCell>
        <CTableHeaderCell style={{ minWidth: "140px" }}>Phone</CTableHeaderCell>
        <CTableHeaderCell style={{ minWidth: "250px" }}>Message</CTableHeaderCell>
        <CTableHeaderCell style={{ minWidth: "160px" }}>Date</CTableHeaderCell>
        <CTableHeaderCell style={{ minWidth: "120px" }}>Status</CTableHeaderCell>
        <CTableHeaderCell style={{ minWidth: "150px" }}>Change Status</CTableHeaderCell>
        <CTableHeaderCell style={{ minWidth: "120px" }}>Action</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      {filteredQueries.map((item, index) => (
        <CTableRow key={item._id}>
          <CTableDataCell>{index + 1}</CTableDataCell>
          <CTableDataCell>{item.name}</CTableDataCell>
          <CTableDataCell>{item.email}</CTableDataCell>
          <CTableDataCell>{item.phone}</CTableDataCell>
          <CTableDataCell>{item.message}</CTableDataCell>
          <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
          <CTableDataCell>
            <span
              className={`badge text-capitalize ${
                item.status === "resolved" ? "bg-success" : "bg-warning text-dark"
              }`}
              style={{
                fontSize: "0.85rem",
                padding: "6px 14px",
                borderRadius: "20px",
              }}
            >
              {item.status}
            </span>
          </CTableDataCell>
          <CTableDataCell>
            <CFormSelect
              size="sm"
              className="form-select-sm"
              value={item.status}
              onChange={(e) =>
                handleStatusChange(item._id, e.target.value, index)
              }
            >
              <option value="">Select</option>
              <option value="resolved">Resolved</option>
              <option value="unresolved">Unresolved</option>
            </CFormSelect>
          </CTableDataCell>
          <CTableDataCell>
            <CButton
              size="sm"
              color="danger"
              variant="outline"
              onClick={() => handleDelete(item._id)}
              className="d-flex align-items-center gap-1"
            >
              <i className="bi bi-trash" />
              Delete
            </CButton>
          </CTableDataCell>
        </CTableRow>
      ))}
    </CTableBody>
  </CTable>
</div>

  );

  return (
    <CRow className="justify-content-center my-4">
      <CCol xs={12} lg={11}>
        <CCard className="shadow-sm border-0">
          <CCardHeader className="bg-primary text-white">
            <CRow className="align-items-center justify-content-between">
              <CCol xs="auto">
                <div className="d-flex align-items-center">
                  <FaComments className="me-2" />
                  <h5 className="mb-0">All Contact Queries</h5>
                </div>
              </CCol>
              <CCol xs="auto">
                <CFormSelect
                  size="sm"
                  style={{ maxWidth: "200px", minWidth: "150px" }}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="resolved">Resolved</option>
                  <option value="unresolved">Unresolved</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody className="px-4 py-3">
            <div className="table-responsive">{renderTable()}</div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ContactUs;
