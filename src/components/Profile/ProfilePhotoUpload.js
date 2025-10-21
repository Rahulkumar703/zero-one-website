"use client";

import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useCallback, useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import { BiEdit } from "react-icons/bi";
import { toast } from "sonner";

const ProfilePhotoUpload = ({ profilePic }) => {
  const { data: session, update } = useSession();

  const [imageUrl, setImageUrl] = useState(profilePic);

  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);

  const { startUpload, permittedFileInfo } = useUploadThing(
    "profilePicUploader",
    {
      onClientUploadComplete: async (res) => {
        setLoading(false);

        const profilePic = res[0].url;

        try {
          setLoading(true);
          const res = await fetch("/api/profile", {
            method: "PATCH",
            body: JSON.stringify({
              profilePic,
            }),
          });

          const data = await res.json();

          if (res.success) {
            const d = await update({
              ...session,
              user: {
                ...session.user,
                profilePic,
              },
            });
          }

          toast[data.type](data.message);
        } catch (error) {
          // console.log(error);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      },
      onUploadError: (error) => {
        setLoading(false);
        toast.error(error.message);
      },
      onUploadBegin: () => {
        setLoading(true);
      },
    }
  );
  const onDrop = useCallback(
    (acceptedFiles) => {
      setImage(acceptedFiles);
    },
    [setImage]
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return setImageUrl(profilePic);
    else if (file.size > 1024 * 1024) {
      setImageUrl(profilePic);
      return toast.error("Image must be less than 1MB");
    }
    setImage([file]);
    const blob = new Blob(image, { type: file.type });
    const objectURL = URL.createObjectURL(blob);
    setImageUrl(objectURL);

    if (file) {
      setLoading(true);
      startUpload([file]);
    }
  };

  return (
    <div
      className={`select-none bg-white/10 w-32 h-32 rounded-full overflow-hidden border border-white/25 relative ${
        loading ? "animate-pulse " : "cursor-pointer group"
      }`}
      {...getRootProps()}
    >
      <input
        {...getInputProps()}
        type="file"
        onChange={handleImageSelect}
        disabled={loading}
      />

      <span className="group-hover:visible invisible transition-opacity z-50 bg-primary/70 absolute w-full h-full left-0 top-0 flex items-center justify-center pointer-events-none">
        <BiEdit className="w-6 h-6 " />
      </span>

      {imageUrl ? (
        <Image
          className="w-full h-full object-cover rounded-full"
          style={{ userDrag: "none" }}
          width={150}
          height={150}
          src={imageUrl}
          alt={"profilePic"}
        />
      ) : (
        <span className="z-50 bg-white/10 absolute w-full h-full left-0 top-0 flex items-center justify-center pointer-events-none">
          <HiOutlineUserCircle className="w-full h-full" />
        </span>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
