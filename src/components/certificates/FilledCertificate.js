"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import generateCertificate from "@/utils/generateCertificate";
import { usePathname } from "next/navigation";
import Button from "../button/Button";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

const RenderPdf = dynamic(() => import("./RenderPdf"), {
  ssr: false,
});

const FilledCertificate = ({ certificate, download = false }) => {
  const [certificateNumber, setCertificateNumber] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const setCertificateUrl = async () => {
      try {
        const fields = [
          ...certificate.template.fields.map((f, i) => ({
            ...f,
            value: certificate.fields[i].value,
          })),
          {
            ...certificate.template.certificateNumber,
            value: certificate.certificateNumber,
          },
        ];
        const url = await generateCertificate(
          fields,
          certificate.template.url,
          certificate.certificateNumber
        );
        setUrl(url);
        setCertificateNumber(certificate.certificateNumber);
      } catch (error) {
        toast.error(error.message);
      }
    };
    setCertificateUrl();
  }, [certificate]);

  const pathName = usePathname();

  return (
    <div>
      {url && certificateNumber ? (
        download ? (
          <div className="flex flex-col justify-center">
            <RenderPdf url={url} />
            <Link
              href={url}
              target="_blank"
              download={`${certificateNumber}.pdf`}
              className="flex w-full justify-end"
            >
              <Button className="max-w-min mt-3">Download</Button>
            </Link>
          </div>
        ) : (
          <RenderPdf url={url} thumbnailMode={true} />
        )
      ) : (
        <Skeleton className={"w-full aspect-video"} />
      )}
    </div>
  );
};

export default FilledCertificate;
