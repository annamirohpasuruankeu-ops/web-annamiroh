import Navbar from '@/components/navbar';
import { Head } from '@inertiajs/react';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title={title} />

            {/* 1. Header Navbar di paling atas */}
            <Navbar />

            {/* 2. Form Login di posisi tengah halaman dengan jarak aman dari Navbar */}
            <main className="flex flex-1 flex-col items-center justify-center p-6 pt-24 md:p-10">
                <div className="w-full max-w-sm space-y-6">
                    {(title || description) && (
                        <div className="space-y-2 text-center">
                            {title && (
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}