"use client";

import AdminNavbar from "../component/AdminNavbar";
import AdminSidebar from "../component/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <AdminNavbar />

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
