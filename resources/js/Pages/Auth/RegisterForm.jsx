import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import {Link, useForm } from '@inertiajs/react';

export default function RegisterForm({role, path}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: role,
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route(path), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <form onSubmit={submit} className='border rounded px-3 py-3 my-3'>
                <div>
                    <h3 className='poppins-semibold'>Sign Up</h3>
                </div>
                <div>
                    <InputLabel htmlFor="username" value="username" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full form-control shadow-none"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <small className='text-secondary fs-8 d-block mt-2'><strong className='text-danger'>* </strong>
                    Spaces are not allowed in usernames. Please use underscores as an alternative
                    </small>
                    <InputError message={errors.name} className="mt-2 fs-8 text-danger" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full form-control shadow-none"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2 fs-8 text-danger" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full form-control shadow-none"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 fs-8 text-danger" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full form-control shadow-none"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 fs-8 text-danger"
                    />
                </div>

                <div className="mt-3 d-flex justify-content-between align-items-center">
                    <Link
                        href={route('login')}
                        className="fs-9 d-block"
                    >
                        Already registered?
                    </Link>
                    <button className="px-3 btn btn-dark poppins-semibold d-block fs-9 py-2" disabled={processing}>
                    Sign Up
                    </button >
                </div>
            </form>
        </>
    );
}
