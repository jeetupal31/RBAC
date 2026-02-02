"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";

interface Role {
    id: string;
    name: string;
}

interface User {
    id: string;
    email: string;
    createdAt: string;
    roles: { role: Role }[];
    // roleIds not usually returned, derived from roles
}

export default function UsersPage() {
    useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [allRoles, setAllRoles] = useState<Role[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null); // null means create new

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    async function fetchUsers() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchRoles() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/roles", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAllRoles(data);
            }
        } catch (e) {
            console.error("Failed to fetch roles");
        }
    }

    const confirmDelete = (id: string) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        const id = userToDelete;
        try {
            const token = localStorage.getItem("token");
            await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (e) {
            alert("Failed to delete");
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setEmail("");
        setPassword("");
        setSelectedRoleIds(new Set());
        setIsModalOpen(true);
    }

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEmail(user.email);
        setPassword(""); // Don't show existing password!
        const userRoleIds = new Set(user.roles.map(r => r.role.id));
        setSelectedRoleIds(userRoleIds);
        setIsModalOpen(true);
    }

    const toggleRole = (rid: string) => {
        const newSet = new Set(selectedRoleIds);
        if (newSet.has(rid)) newSet.delete(rid);
        else newSet.add(rid);
        setSelectedRoleIds(newSet);
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const body: any = {
                email,
                roleIds: Array.from(selectedRoleIds)
            };
            // Only send password if provided
            if (password) body.password = password;

            let url = "/api/users";
            let method = "POST";

            if (editingUser) {
                url = `/api/users/${editingUser.id}`;
                method = "PUT";
                if (!password) delete body.password;
            } else {
                if (!password) throw new Error("Password is required for new users");
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error("Failed to save user");

            setIsModalOpen(false);
            fetchUsers();

        } catch (err: any) {
            alert(err.message);
        }
    }

    // Filtering
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.roles.some(r => r.role.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Users
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white sm:text-sm pl-9 py-2 border"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <button
                        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={openCreateModal}
                    >
                        <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                        </svg>
                        Add User
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="p-6 space-y-4 animate-pulse">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 dark:bg-zinc-700 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Roles
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Joined
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700 bg-white dark:bg-zinc-800">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No users found matching "{searchQuery}"
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex gap-1 flex-wrap max-w-xs">
                                                {user.roles.length > 0 ? user.roles.map(({ role }) => (
                                                    <span key={role.id} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                                                        {role.name}
                                                    </span>
                                                )) : <span className="text-sm text-gray-400">No roles</span>}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                                                onClick={() => openEditModal(user)}
                                            >
                                                Edit
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                onClick={() => confirmDelete(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Edit User" : "Create New User"}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white sm:text-sm p-2 border"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                        </label>
                        <input
                            id="password"
                            type="password"
                            required={!editingUser}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white sm:text-sm p-2 border"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign Roles</p>
                        <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2 dark:border-zinc-700">
                            {allRoles.map(role => (
                                <div key={role.id} className="flex items-center">
                                    <input
                                        id={`role-${role.id}`}
                                        type="checkbox"
                                        checked={selectedRoleIds.has(role.id)}
                                        onChange={() => toggleRole(role.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:bg-zinc-700 dark:border-zinc-600"
                                    />
                                    <label htmlFor={`role-${role.id}`} className="ml-3 block text-sm font-medium text-gray-900 dark:text-white cursor-pointer select-none">
                                        {role.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-zinc-700 dark:text-white dark:ring-zinc-600 dark:hover:bg-zinc-600">Cancel</button>
                        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            {editingUser ? "Save Changes" : "Create User"}
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                isDestructive={true}
                confirmText="Delete"
            />
        </div>
    );
}
