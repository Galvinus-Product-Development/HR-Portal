import React from 'react'
import Sidebar from './sidebar/sidebar'
import Header from './header/header'
import { Outlet } from 'react-router-dom'
import './layout.css'

const Layout = () => {
    return (
        <div className="layout-container">
            {/* Sidebar */}
            <Header />
            <div className="content-wrapper">
                <Sidebar />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout
