import React, { useState } from 'react'
import { CAvatar, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from './../../assets/images/profileLogo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ChangePasswordModal from './ChangePasswordModal'
import { IoMdLogOut } from "react-icons/io";

const AppHeaderDropdown = () => {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_BASE_URL_BACKEND

  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_URL}api/v1/admin/logout`, {
        withCredentials: true,
      })
      toast.success('Logged out successfully')
      localStorage.removeItem('token')

      // FORCE FULLY LOGOUT AND REDIRECT TO LOGIN PAGE
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('Logout failed')
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>

        <CDropdownItem onClick={() => setShowChangePassword(true)}>
           <IoMdLogOut className="me-2" />
          Change Password
        </CDropdownItem>

        {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
