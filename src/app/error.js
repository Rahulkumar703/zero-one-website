"use client";

import Button from "@/components/button/Button";
import { useRouter } from "next/navigation";
import React from "react";
import { BiLeftArrow, BiRefresh } from "react-icons/bi";

const Error = ({ error, reset }) => {
  const router = useRouter();
  const goBack = () => router.back();
  return (
    <div className="mx-auto container flex flex-col items-center w-full min-h-[80svh] justify-center">
      <div className="card p-6 flex flex-col items-center gap-4">
        <h2 className="font-bold text-4xl">OOPs !</h2>
        <p className="max-w-72 text-center my-4 text-accent">{error.message}</p>
        <div className="flex items-center justify-between w-full">
          <Button variant={"outline"} onClick={goBack}>
            <BiLeftArrow size={18} />
            Back
          </Button>
          <Button variant={"filled"} onClick={reset}>
            <BiRefresh size={20} />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
