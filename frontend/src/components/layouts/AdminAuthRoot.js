import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../admin/AdminNavbar'

// root for authenticated admin
const AdminAuthRoot = ()  => {
  return <><AdminNavbar /><Outlet /></>
}

export default AdminAuthRoot