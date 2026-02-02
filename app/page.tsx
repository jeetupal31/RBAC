"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-black">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-32">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              RBAC Admin
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Role-Based Access Control
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Securely manage users, roles, and permissions with an intuitive admin dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 dark:border-zinc-600 px-8 py-3 text-lg font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage users with ease</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">🔐</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Role Control</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Define and assign roles dynamically</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">✨</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permissions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fine-grained permission control</p>
            </div>
          </div>

          <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Demo Credentials:</span> admin@example.com / password
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
