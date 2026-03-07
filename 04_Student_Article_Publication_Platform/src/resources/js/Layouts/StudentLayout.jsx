import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Icon } from 'react-icon';

export default function StudentLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
