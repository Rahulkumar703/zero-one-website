"use client";
import { useState } from "react";
import Button from "@/components/button/Button";
import StyledInput from "@/components/input/StyledInput";
import BottomGlitter from "@/components/StyledText/BottomGlitter";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function ProfileForm({ user }) {
  const { data: session, update } = useSession();

  const [loading, setLoading] = useState(false);

  const [userProfile, setUserProfile] = useState(user);

  const [password, setPassword] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
    loading: false,
  });

  const submitForm = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      setLoading(true);
      const { email, phone, username, gitHub, linkedIn, bio, otherLinks } =
        userProfile;
      const res = await fetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          email,
          phone,
          username,
          gitHub,
          linkedIn,
          bio,
          otherLinks,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUserProfile((prev) => ({ ...prev, ...data.profile }));
        await update({
          ...session,
          user: {
            ...session.user,
            email: data.profile.email,
            username: data.profile.username,
          },
        });
        console.log(data.profile.username);
      }

      toast[data.type](data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      setPassword((prev) => ({ ...prev, loading: true }));
      const { oldPass, newPass, confirmPass } = password;

      if (newPass !== confirmPass) return toast.error("Passwords not Matched.");

      const res = await fetch("/api/profile/updatePassword", {
        method: "PUT",
        body: JSON.stringify({ oldPass, newPass }),
      });

      const data = await res.json();
      if (data.success) {
        setPassword({ oldPass: "", newPass: "", confirmPass: "" });
      }

      toast[data.type](data.message);
    } catch (error) {
      // console.log(error);
      toast.error(error.message);
    } finally {
      setPassword((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleChange = (e) => {
    setUserProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full flex flex-col mt-16">
      <form onSubmit={submitForm} className="flex flex-col ">
        <div className="flex flex-col border border-white/5 shadow-cus  p-6 rounded-3xl">
          <div className="flex flex-row lg:flex-col gap-2 items-center justify-center w-full">
            <StyledInput
              type="desc"
              value={userProfile?.bio}
              name="bio"
              label="Bio"
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="flex flex-row lg:flex-col gap-2 items-center justify-center w-full relative">
            <StyledInput
              value={userProfile?.username}
              name="username"
              label="Username"
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="flex flex-row lg:flex-col gap-2 items-center justify-center w-full">
            <StyledInput
              type="email"
              value={userProfile?.email}
              name="email"
              label="Email"
              onChange={handleChange}
              disabled={loading}
            />
            <StyledInput
              type="number"
              value={userProfile?.phone}
              name="phone"
              label="Phone"
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="flex flex-row lg:flex-col gap-2 items-center justify-center w-full">
            <StyledInput
              value={userProfile?.gitHub}
              name="gitHub"
              label="GitHub Link"
              onChange={handleChange}
              disabled={loading}
            />
            <StyledInput
              value={userProfile?.linkedIn}
              name="linkedIn"
              label="LinkedIn Link"
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          {user?.email !== userProfile?.email ||
          user?.bio !== userProfile?.bio ||
          user?.phone !== userProfile?.phone ||
          user?.gitHub !== userProfile?.gitHub ||
          user?.linkedIn !== userProfile?.linkedIn ||
          user?.username !== userProfile?.username ? (
            <Button type="submit" className="ml-auto" loading={loading}>
              Update Profile
            </Button>
          ) : null}
        </div>
      </form>
      <form
        className="mt-12 flex flex-col border border-white/5 shadow-cus  p-6 rounded-3xl"
        onSubmit={updatePassword}
      >
        <BottomGlitter text="Update Password" />
        <div className="flex flex-row lg:flex-col gap-2 items-center justify-center w-full mt-10">
          <StyledInput
            type="password"
            value={password?.oldPass}
            name="oldPass"
            label="Old Password"
            onChange={(e) => {
              setPassword((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
          />
        </div>
        <div className="flex flex-row lg:flex-col gap-2 items-center justify-center w-full">
          <StyledInput
            type="password"
            value={password?.newPass}
            name="newPass"
            label="Set Password"
            onChange={(e) => {
              setPassword((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
          />
          <StyledInput
            type="password"
            value={password?.confirmPass}
            name="confirmPass"
            label="Confirm Password"
            onChange={(e) => {
              setPassword((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
          />
        </div>
        {password.oldPass && password.newPass && password.confirmPass ? (
          <Button type="submit" className="ml-auto" loading={password.loading}>
            Update Password
          </Button>
        ) : null}
      </form>
    </div>
  );
}
