"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";

interface Permission {
    id: string;
    name: string;
}

interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export default function RolesPage() {
    useAuth();
    const [roles, setRoles] = useState<Role[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPermModalOpen, setIsPermModalOpen] = useState(false);

    // Selection state
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [newRoleName, setNewRoleName] = useState("");
    const [selectedPermIds, setSelectedPermIds] = useState<Set<string>>(new Set());

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    async function fetchRoles() {
        try {
            const token = localStorage.getItem("token");
            // Getting roles (API currently does NOT return permissions, assume we need to fetch individual details OR update API.
            // For efficiency, let's update GET /api/roles to include permissions? 
            // Checking `app/api/roles/route.ts` - it does NOT include permissions. 
            // Let's stick to current API: `GET /api/roles` list. 
            // `GET /api/roles/[id]` includes permissions.
            // BUT, to show permissions in the card, we'd need them. 
            // Let's rely on fetching `GET /api/roles` and maybe lazily fetching permissions OR just using what we have.
            // Wait, `app/api/roles/[id]/route.ts` is PUT/DELETE.
            // `app/api/roles/[id]/permissions/route.ts` is GET/POST permissions.
            // Let's update `fetchRoles` to also fetch permission details if needed, 
            // or simply rely on `GET /api/roles` and fetch permissions when opening modal.
            // To show "3 permissions" count on card, we might want them. 
            // Let's keep it simple: Fetch standard roles list. When clicking "Manage", fetch specific role's permissions.
            const res = await fetch("/api/roles", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch roles");
            const data = await res.json();
            setRoles(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchPermissions() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/permissions", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAllPermissions(data);
            }
        } catch (e) {
            console.error("Failed to fetch permissions list");
        }
    }

    const confirmDelete = (id: string) => {
        setRoleToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!roleToDelete) return;
        const id = roleToDelete;
        try {
            const token = localStorage.getItem("token");
            await fetch(`/api/roles/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchRoles();
        } catch (e) {
            alert("Failed to delete");
        }
    }

    // Create Role Logic
    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/roles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newRoleName })
            });

            if (!res.ok) throw new Error("Failed to create role");

            setNewRoleName("");
            setIsCreateModalOpen(false);
            fetchRoles();
        } catch (err: any) {
            alert(err.message);
        }
    }

    // Manage Permissions Logic
    const openPermModal = async (role: Role) => {
        setSelectedRole(role);
        // Fetch current permissions for this role
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/roles/${role.id}/permissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // data.permissions is array of objects
                const currentIds = new Set(data.permissions.map((p: Permission) => p.id));
                setSelectedPermIds(currentIds as Set<string>);
            }
        } catch (e) {
            console.error(e);
            setSelectedPermIds(new Set());
        }
        setIsPermModalOpen(true);
    }

    const togglePermission = (id: string) => {
        const newSet = new Set(selectedPermIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedPermIds(newSet);
    }

    const handleSavePermissions = async () => {
        if (!selectedRole) return;
        try {
            const token = localStorage.getItem("token");
            // API expects { permissionIds: string[] }
            const res = await fetch(`/api/roles/${selectedRole.id}/permissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ permissionIds: Array.from(selectedPermIds) })
            });
            if (!res.ok) throw new Error("Failed to update permissions");

            setIsPermModalOpen(false);
            // Optional: refetch roles if we displayed permission counts
        } catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Roles
                </h1>
                <button
                    className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Create Role
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading roles...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {role.name}
                                    </h3>
                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30">
                                        Role
                                    </span>
                                </div>
                                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    Manage permissions for this role.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-4 border-t border-gray-100 pt-4 dark:border-zinc-700">
                                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                    onClick={() => openPermModal(role)}
                                >
                                    Manage Permissions
                                </button>
                                <button className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                                    onClick={() => confirmDelete(role.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Role Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Role"
            >
                <form onSubmit={handleCreateRole} className="space-y-4">
                    <div>
                        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Name</label>
                        <input
                            id="roleName"
                            type="text"
                            required
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white sm:text-sm p-2 border"
                            placeholder="e.g. Editor"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-zinc-700 dark:text-white dark:ring-zinc-600 dark:hover:bg-zinc-600">Cancel</button>
                        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create</button>
                    </div>
                </form>
            </Modal>

            {/* Permissions Modal */}
            <Modal
                isOpen={isPermModalOpen}
                onClose={() => setIsPermModalOpen(false)}
                title={`Permissions for ${selectedRole?.name}`}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Select permissions to assign to this role.</p>
                    <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2 dark:border-zinc-700">
                        {allPermissions.map((perm) => (
                            <div key={perm.id} className="flex items-center">
                                <input
                                    id={`perm-${perm.id}`}
                                    type="checkbox"
                                    checked={selectedPermIds.has(perm.id)}
                                    onChange={() => togglePermission(perm.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:bg-zinc-700 dark:border-zinc-600"
                                />
                                <label htmlFor={`perm-${perm.id}`} className="ml-3 block text-sm font-medium text-gray-900 dark:text-white cursor-pointer select-none">
                                    {perm.name}
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">{/* description could go here */}</span>
                                </label>
                            </div>
                        ))}
                        {allPermissions.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No permissions available.</p>}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsPermModalOpen(false)} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-zinc-700 dark:text-white dark:ring-zinc-600 dark:hover:bg-zinc-600">Cancel</button>
                        <button type="button" onClick={handleSavePermissions} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Changes</button>
                    </div>
                </div>
            </Modal>



            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Role"
                message="Are you sure you want to delete this role? This might affect users assigned to this role."
                isDestructive={true}
                confirmText="Delete"
            />
        </div >
    );
}
