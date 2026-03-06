import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-5 border-b pb-4">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-600">Account Verification</p>
                <h1 className="mt-1 font-serif text-3xl font-black">Verify Email</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Confirm your email by clicking the verification link we sent. You can request another link below.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>Resend Verification Email</PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
