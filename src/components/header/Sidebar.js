"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CgClose } from "react-icons/cg";
import Link from "next/link";
import Logo from "../logo/Logo";
import { signOut, useSession } from "next-auth/react";
import Button from "../button/Button";
import Image from "next/image";
import { MdLogin } from "react-icons/md";
import { usePathname } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";

function Sidebar({ isMounted, unmount }) {
  const path = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const documentWidthRef = useRef(null);

  const { data } = useSession();

  useEffect(() => {
    let timeoutId;
    if (isMounted && !isTransitioning) {
      setIsTransitioning(true);
      documentWidthRef.current = document.documentElement.clientWidth;
      document.documentElement.classList.add("scroll-lock");

      /*
        After locking the body scroll, the scrollbar is hidden, so we have to compensate for the extra space
        created due to no scrollbar by giving the document an extra right padding according to the extra created space
      */
      if (documentWidthRef.current !== document.documentElement.clientWidth) {
        document.documentElement.style.paddingRight = `${
          document.documentElement.clientWidth - documentWidthRef.current
        }px`;
      }
    } else if (!isMounted && isTransitioning) {
      timeoutId = setTimeout(() => {
        setIsTransitioning(false);
        document.documentElement.classList.remove("scroll-lock");
        document.documentElement.style.paddingRight = 0;
      }, 300);
    }

    return () => {
      clearTimeout(timeoutId);
      if (
        document.documentElement.classList.contains("scroll-lock") &&
        isTransitioning
      ) {
        document.documentElement.classList.remove("scroll-lock");
        document.documentElement.style.paddingRight = 0;
      }
    };
  }, [isMounted, isTransitioning]);

  if (!isMounted && !isTransitioning) return null;

  return createPortal(
    <aside
      className={`h-screen w-screen lg:hidden fixed top-0 left-0 z-[200] transition-transform duration-300 ease-out flex flex-col ${
        isTransitioning && isMounted ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ backgroundColor: "rgb(10, 10, 10)" }}
    >
      <div
        className="flex justify-between items-center relative py-2 px-8 sm:px-6 xs:px-3"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Logo />
        <div onClick={unmount} className="cursor-pointer inline-block ml-auto">
          <CgClose size={32} />
        </div>
      </div>

      <nav className="grid gap-6 sm:px-6 xs:px-3 xs:gap-4 overflow-auto flex-1">
        <div className="grid mt-6">
          {path === "/login" ? null : data && data.user ? (
            <div className="max-w-lg mx-auto w-full shadow-cus border border-l-white/5 border-t-white/5 border-r-black/25 border-b-black/25 rounded-3xl flex flex-col gap-4 items-center p-4">
              <div className="flex xs:flex-row flex-col items-center xs:items-start mx-auto gap-6 w-full">
                <div className="w-24 h-24 border border-white/10 rounded-full">
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
                <div className="flex flex-col gap-1 xs:text-left text-center">
                  <h2 className="capitalize text-lg font-bold">
                    {data.user.name}
                  </h2>
                  <p className="lowercase text-muted-foreground">
                    {data.user.email}
                  </p>
                  <p className="text-muted-foreground">{data.user.roll}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full ">
                <div className="flex xs:flex-row flex-col gap-1">
                  {data && data.user && data.user.role === "ADMIN" ? (
                    <Link
                      href="https://admin.zeroonemce.com"
                      className="flex-1 bg-white/5 p-2 py-3 flex justify-center hover:bg-white/10 transition-all items-center xs:rounded-r-none rounded-full"
                    >
                      Admin
                    </Link>
                  ) : null}
                  <Link
                    href={`/user/${data.user.username}`}
                    onClick={unmount}
                    className="flex-1 bg-white/5 p-2 py-3 flex justify-center hover:bg-white/10 transition-all items-center xs:rounded-l-none rounded-full"
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
          ) : (
            <Link
              href="/login"
              className="flex rounded-full ml-auto"
              onClick={unmount}
            >
              <Button variant={"filled"}>
                <MdLogin className="fill-inherit" />
                Login
              </Button>
            </Link>
          )}
        </div>

        <ul className="grid grid-cols-2 gap-4 w-full my-10 sm:px-6 xs:px-3 xs:gap-4">
          {/* Home Section */}
          <li className="w-full mb-4">
            <h3 className="text-sm pb-4 border-b border-white/10 font-semibold text-white/60 mb-3 px-4">
              HOME
            </h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                Contact Us
              </Link>
              <Link
                href="/teams"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                Our Teams
              </Link>
            </div>
          </li>

          {/* Learn Section */}
          <li className="w-full mb-4">
            <h3 className="text-sm pb-4 border-b border-white/10 font-semibold text-white/60 mb-3 px-4">
              LEARN
            </h3>
            <div className="space-y-2">
              <Link
                href="/resources"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                Resources
              </Link>
              <Link
                href="/playground"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                Playground
              </Link>
              <Link
                href="/playground"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                Practice
              </Link>
            </div>
          </li>

          {/* Contests Section */}
          <li className="w-full mb-4">
            <h3 className="text-sm pb-4 border-b border-white/10 font-semibold text-white/60 mb-3 px-4">
              CONTESTS
            </h3>
            <div className="space-y-2">
              <Link
                href="/ongoing-contests"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                Ongoing Contests
              </Link>
              <Link
                href="/past-contests"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                Past Contests
              </Link>
              <Link
                href="/gallery"
                className="block w-fit px-4 py-3 text-lg font-medium text-white hover:bg-secondary rounded-full transition-all duration-200 ease-in-out"
                onClick={unmount}
              >
                Gallery
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </aside>,
    document.getElementById("overlay")
  );
}
export default Sidebar;
