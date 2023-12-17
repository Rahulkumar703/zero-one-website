"use client"
import Button from '../button/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';

const LoginBtn = ({ unmount = () => { } }) => {

    const SpanStyle = {
        zIndex: 1,
        color: 'inherit',
        transition: 'all 300ms ease-in-out',
    };

    const [active, setActive] = useState(false);

    const path = usePathname();
    const { data } = useSession();

    const popUpRef = useRef(null);

    useEffect(() => {
        const handleOutClick = (e) => {
            if (!popUpRef?.current?.contains(e.target)) {
                setActive(false);
            }
        }

        document.addEventListener('click', handleOutClick);
        return () => document.removeEventListener('click', handleOutClick);
    })

    return (
        path === '/login'
            ?
            null
            :
            data && data.user ?
                <div className='relative w-10 h-10'>
                    <button className='w-full h-full rounded-full  border border-white/20 cursor-pointer' onClick={() => setActive(prev => !prev)}>
                        <Image src={data.user.profilePic} width={50} height={50} alt={data.user.name} className="rounded-full w-full h-full object-cover object-center" />
                    </button>
                    {
                        active &&
                        <div ref={popUpRef} className="absolute -right-[1rem] top-[75px] w-96 bg-primary border border-white/10 z-[100] rounded-2xl flex flex-col gap-4 items-center p-4">
                            <h3 className='font-semibold'>{data.user.email}</h3>
                            <div className="flex flex-col items-center mx-auto gap-2">
                                <div className='w-24 h-24  border border-white/10 rounded-full'>
                                    <Image src={data.user.profilePic} width={80} height={80} alt={data.user.name} className="rounded-full w-full h-full object-cover object-center" />
                                </div>
                                <h2 className='capitalize text-lg font-bold'>Hi, {data.user.name}</h2>
                            </div>
                            <div className="flex gap-2 w-full">
                                <Link href={'/profile'} onClick={() => setActive(false)} className='flex-1 bg-white/10 p-2 flex justify-center rounded-l-xl hover:bg-white/20 transition-all items-center'>Profile</Link>
                                <button onClick={signOut} className='flex-1 bg-red-500 p-2 flex justify-center rounded-r-xl hover:bg-red-400 transition-all items-center'>Logout</button>
                            </div>
                        </div>
                    }
                </div>
                :
                <Link
                    href="/login"
                    className="flex rounded-full"
                    onClick={unmount}
                >
                    <Button
                        style={{ border: 'none' }}
                        className="bg-primary-light text-primary hover:text-primary-light"
                    >
                        <span style={SpanStyle}>Login</span>
                    </Button>
                </Link>
    )
}

export default LoginBtn