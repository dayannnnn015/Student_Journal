import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-5 border-b pb-4">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-600">Account Recovery</p>
                <h1 className="mt-1 font-serif text-3xl font-black">Forgot Password</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Enter your email and we will send a secure reset link.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-6 flex items-center justify-between">
                    <Link href={route('login')} className="text-sm text-gray-600 underline hover:text-gray-900">
                        Back to sign in
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Email Reset Link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
