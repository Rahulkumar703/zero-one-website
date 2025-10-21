"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import StyledInput from "../input/StyledInput";
import Button from "../button/Button";
import { MdOutlineCloudDone } from "react-icons/md";

const ActivateAccountForm = () => {
  const token = useSearchParams().get("token");
  //   if (!token) redirect("/login");

  const router = useRouter();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
    loading: false,
  });

  const handleChange = (e) => {
    setSignupForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.loading || !token) return;
    if (form.password !== form.confirmPassword)
      return toast.error("Password does not matched.");
  };

  return (
    <div>
      {
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-11/12 mx-auto"
        >
          <div className="flex gap-4 md:gap-2 justify-between items-center flex-wrap xl:flex-col xl:justify-start xl:items-start">
            <StyledInput
              disabled={form.loading}
              id="password"
              value={form.password}
              onChange={handleChange}
              name="password"
              label="Create Password"
              required
              className="w-full"
              type="password"
            />
            <StyledInput
              disabled={form.loading}
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              label="Re-enter Password"
              required
              className="w-full"
              type="password"
            />
          </div>

          {/* <p className='text-base'>Already a member ? <Link href="/login" className='text-accent hover:underline'>Login</Link></p> */}

          <Button
            disabled={form.loading}
            variant={"filled"}
            type="submit"
            className={"ml-auto"}
            loading={loading}
          >
            <MdOutlineCloudDone className="fill-inherit" />
            Activate Account
          </Button>
        </form>
      }
    </div>
  );
};

export default ActivateAccountForm;
