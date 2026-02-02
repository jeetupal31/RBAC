"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";

export default function DashboardPage() {
    useAuth();
    const [stats, setStats] = useState({ users: 0, roles: 0, permissions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const [usersRes, rolesRes, permsRes] = await Promise.all([
                fetch("/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                }).catch(() => null),
                fetch("/api/roles", {
                    headers: { Authorization: `Bearer ${token}` },
                }).catch(() => null),
                fetch("/api/permissions", {
                    headers: { Authorization: `Bearer ${token}` },
                }).catch(() => null),
            ]);

            let users = 0, roles = 0, permissions = 0;

            if (usersRes?.ok) {
                const data = await usersRes.json();
                users = Array.isArray(data) ? data.length : 0;
            }

            if (rolesRes?.ok) {
                const data = await rolesRes.json();
                roles = Array.isArray(data) ? data.length : 0;
            }

            if (permsRes?.ok) {
                const data = await permsRes.json();
                permissions = Array.isArray(data) ? data.length : 0;
            }

            setStats({ users, roles, permissions });
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card 1 */}
                <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-800 border dark:border-zinc-700">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.users}</p>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-800 border dark:border-zinc-700">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Roles</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.roles}</p>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-800 border dark:border-zinc-700">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Permissions</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.permissions}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 shadow-lg text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to the RBAC Admin Panel</h2>
                <p className="opacity-90">
                    Securely manage users, roles, and permissions from this centralized dashboard. Use the sidebar to navigate.
                </p>
            </div>
        </div>
    );
}
