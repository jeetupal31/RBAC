"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navigation = [
    { name: "Overview", href: "/dashboard" },
    { name: "Users", href: "/dashboard/users" },
    { name: "Roles", href: "/dashboard/roles" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="flex flex-col w-64 border-r dark:border-zinc-800 bg-white dark:bg-black min-h-screen">
            <div className="flex h-16 items-center px-6 border-b dark:border-zinc-800">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    RBAC Admin
                </span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-zinc-800 dark:text-white"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t dark:border-zinc-800">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}
