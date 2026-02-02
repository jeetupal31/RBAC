import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-zinc-900">
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
