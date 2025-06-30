import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'


const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'New',
    },
  },
  {
    component: CNavTitle,
    name: 'Project',
  },
  {
    component: CNavItem,
    name: 'Project Update',
    to: '/project/projectUpdates',
    // icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Project Insert',
    to: '/project/projectUploads',
    // icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Query',
  },
    {
    component: CNavItem,
    name: 'Contact Us Query',
    to: '/query/contactusquery',
    // icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
]

export default _nav
