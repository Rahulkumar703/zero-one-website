"use client";
import BottomGlitter from "@/components/StyledText/BottomGlitter";
import Button from "@/components/button/Button";
import StyledInput from "@/components/input/StyledInput";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdSend } from "react-icons/md";
import { toast } from "sonner";

const SignupPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [emailOrRoll, setEmailOrRoll] = useState("");

  const sendPasswordResetLink = async (e) => {
    e.preventDefault();

    if (emailOrRoll === "")
      return toast.error("please enter your roll or email");

    try {
      setLoading(true);
      const res = await fetch("/api/resetPassword", {
        method: "POST",
        body: JSON.stringify({ emailOrRoll }),
      });

      const data = await res.json();

      if (res.status === 200) {
        router.push("/login");
      }

      console.log(data);
      toast[data.type](data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-70 text-lg grid place-items-center h-[calc(100vh-88px)] ">
      <div className="max-w-xl w-full border border-l-white/5 border-t-white/5 border-r-black/25 border-b-black/25  shadow-cus shadow-black p-6 rounded-3xl">
        <BottomGlitter text={"Forgot Password"} />
        <form
          method="POST"
          onSubmit={sendPasswordResetLink}
          className="flex flex-col gap-4 mt-8 "
        >
          <div className="flex gap-4 md:gap-2 justify-between items-center flex-wrap xl:flex-col xl:justify-start xl:items-start">
            <StyledInput
              id="emailOrRoll"
              value={emailOrRoll}
              onChange={(e) => {
                setEmailOrRoll(e.target.value);
              }}
              name="emailOrRoll"
              label="Email or Roll"
              required
              className="w-full"
              type="text"
            />
          </div>
          {/* <p className='text-base'>Already a member ? <Link href="/login" className='text-accent hover:underline'>Login</Link></p> */}

          <Button
            variant={"filled"}
            type="submit"
            className={"w-auto md:w-full ml-auto"}
            loading={loading}
          >
            Send Reset Link
            <MdSend className="fill-inherit" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default SignupPage;
