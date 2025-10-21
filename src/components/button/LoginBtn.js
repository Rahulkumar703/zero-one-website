"use client";
import Button from "../button/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { MdLogin } from "react-icons/md";
import ProfilePic from "../Profile/ProfilePic";
import { UserCircle2 } from "lucide-react";
import Image from "next/image";

const LoginBtn = ({ unmount = () => {} }) => {
  const [active, setActive] = useState(false);

  const path = usePathname();
  const { data } = useSession();
  const username = data?.user?.username;

  const popUpRef = useRef(null);

  useEffect(() => {
    const handleOutClick = (e) => {
      if (!popUpRef?.current?.contains(e.target)) {
        setActive(false);
      }
    };

    document.addEventListener("click", handleOutClick);
    return () => document.removeEventListener("click", handleOutClick);
  });

  return data?.user ? (
    <div className="relative w-10 h-10 lg:block hidden">
      <button
        className="w-full h-full rounded-full border border-border cursor-pointer flex items-center justify-center overflow-hidden"
        onClick={() => setActive((prev) => !prev)}
      >
        <ProfilePic />
      </button>
      {active && (
        <div
          ref={popUpRef}
          className="absolute -right-[1rem] top-[75px] w-96 shadow-cus border backdrop-blur-3xl border-l-white/5 border-t-white/5 border-r-black/25 border-b-black/25  rounded-3xl flex flex-col gap-4 items-center p-4"
        >
          <div className="flex flex-col items-center mx-auto gap-2">
            <div className="w-32 h-32 border border-white/10 rounded-full">
              {data.user.profilePic ? (
                <Image
                  src={data.user.profilePic}
                  width={80}
                  height={80}
                  quality={100}
                  alt={data.user.name}
                  className="rounded-full w-full h-full object-cover object-center"
                />
              ) : (
                <FaCircleUser size={100} />
              )}
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h2 className="capitalize text-lg font-bold">{data.user.name}</h2>
              <p className="lowercase text-muted-foreground">
                {data.user.email}
              </p>
              <p className="text-muted-foreground">{data.user.roll}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full ">
            <div className="flex flex-row gap-1">
              {data && data.user && data.user.role === "ADMIN" ? (
                <Link
                  href="https://admin.zeroonemce.com"
                  className="flex-1 bg-white/5 p-2 py-3 flex justify-center hover:bg-white/10 transition-all items-center rounded-r-none rounded-full"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                href={`/user/${data.user.username}`}
                onClick={unmount}
                className="flex-1 bg-white/5 p-2 py-3 flex justify-center hover:bg-white/10 transition-all items-center rounded-l-none rounded-full"
              >
                Profile
              </Link>
            </div>
            <button
              onClick={signOut}
              className="flex-1 bg-red-500 p-2 py-3 flex justify-center rounded-full hover:bg-red-600 transition-all items-center"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Link
      href="/login"
      className="lg:flex rounded-full hidden"
      onClick={unmount}
    >
      <Button variant={"filled"}>
        <MdLogin className="fill-inherit" />
        Login
      </Button>
    </Link>
  );
};

export default LoginBtn;
