import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa' 

const ChangePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [loading, setLoading] = useState(false)

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    try {
      setLoading(true)
      const BASE_URL = import.meta.env.VITE_API_BASE_URL

      const response = await axios.put(
        `${BASE_URL}api/v1/admin/changepassword`,
        formData,
        {
          withCredentials: true,
        }
      )

      toast.success(response.data.msg || 'Password changed successfully')
      onClose()
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error.response?.data?.msg || 'Failed to change password. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible={true} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Change Password</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {/* Current Password */}
          <CInputGroup className="mb-3">
            <CFormInput
              type={showPassword.current ? 'text' : 'password'}
              placeholder="Current Password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
            <CInputGroupText onClick={() => toggleVisibility('current')} style={{ cursor: 'pointer' }}>
              {showPassword.current ? <FaEyeSlash /> : <FaEye />}
            </CInputGroupText>
          </CInputGroup>

          {/* New Password */}
          <CInputGroup className="mb-3">
            <CFormInput
              type={showPassword.new ? 'text' : 'password'}
              placeholder="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <CInputGroupText onClick={() => toggleVisibility('new')} style={{ cursor: 'pointer' }}>
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </CInputGroupText>
          </CInputGroup>

          {/* Confirm Password */}
          <CInputGroup>
            <CFormInput
              type={showPassword.confirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <CInputGroupText onClick={() => toggleVisibility('confirm')} style={{ cursor: 'pointer' }}>
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </CInputGroupText>
          </CInputGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ChangePasswordModal
