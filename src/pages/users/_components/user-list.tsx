import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
} from 'lucide-react';

// --- Mock Data (Matching your image exactly) ---
const users = [
  { id: 1, name: "Alice Johnson", email: "alice.j@example.com", role: "Admin", lastLogin: "10 days ago", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Bob Williams", email: "bob.w@example.com", role: "Vender", lastLogin: "2 days ago", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Charlie Davis", email: "charlie.d@example.com", role: "Stock Controller", lastLogin: "5 minutes ago", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Diana Miller", email: "diana.m@example.com", role: "Admin", lastLogin: "10 seconds ago", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Eve Brown", email: "eve.b@example.com", role: "Admin", lastLogin: "4 days ago", avatar: "https://i.pravatar.cc/150?u=5" },
  { id: 6, name: "Frank White", email: "frank.w@example.com", role: "Vender", lastLogin: "20 minutes ago", avatar: "https://i.pravatar.cc/150?u=6" },
];

// --- Reusable UI Components (Simulating ShadCN) ---

const Badge = ({ role }) => {
  let styles = "px-3 py-1 rounded-full text-xs font-medium";
  
  // Specific color matching based on the design
  switch (role) {
    case "Admin":
      styles += " bg-emerald-100 text-emerald-700";
      break;
    case "Vender":
      styles += " bg-red-100 text-red-600";
      break;
    case "Stock Controller":
      styles += " bg-amber-100 text-amber-700";
      break;
    default:
      styles += " bg-gray-100 text-gray-700";
  }

  return <span className={styles}>{role}</span>;
};

const Avatar = ({ src, alt }) => (
  <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-100">
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  </div>
);

const Button = ({ children, variant = "primary", className = "", icon: Icon, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[#5c52d6] hover:bg-[#4b43b3] text-white focus:ring-[#5c52d6]", // Custom purple from image
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-200", // Removed bg-white
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

// --- Main Application Component ---

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    // Removed bg-white from the root container
    <div className="min-h-screen p-4 sm:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <span>Applications</span>
          <span className="mx-2">/</span>
          <span>Users</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">List of users</span>
        </nav>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                // Removed bg-white, added bg-transparent
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Dropdown (Visual Only) */}
            <div className="relative">
              {/* Removed bg-white, added bg-transparent */}
              <button className="flex items-center justify-between w-full sm:w-40 px-3 py-2 border border-gray-200 rounded-lg bg-transparent text-sm text-gray-700 hover:bg-gray-50 focus:outline-none shadow-sm">
                <span>Sort by: Role</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Create Button */}
          <Button icon={Plus} className="w-full sm:w-auto shadow-md shadow-indigo-200">
            Create New
          </Button>
        </div>

        {/* Data Table */}
        {/* Removed bg-white */}
        <div className="grid grid-cols-1 rounded-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              {/* Removed bg-white */}
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Avatar</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              {/* Removed bg-white */}
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Avatar src={user.avatar} alt={user.name} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.lastLogin}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge role={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          {/* Removed bg-white, added bg-transparent */}
          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-transparent p-1 shadow-sm">
            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button className="px-3 py-1.5 mx-1 rounded-md bg-[#5c52d6] text-white text-sm font-medium">1</button>
            <button className="px-3 py-1.5 mx-1 rounded-md hover:bg-gray-100 text-gray-600 text-sm font-medium">2</button>
            <button className="px-3 py-1.5 mx-1 rounded-md hover:bg-gray-100 text-gray-600 text-sm font-medium">3</button>
            <button className="px-3 py-1.5 mx-1 rounded-md hover:bg-gray-100 text-gray-600 text-sm font-medium">4</button>
            
            <span className="px-2 text-gray-400">...</span>
            
            <button className="px-3 py-1.5 mx-1 rounded-md hover:bg-gray-100 text-gray-600 text-sm font-medium">10</button>
            
            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}