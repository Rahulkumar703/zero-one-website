import Image from "next/image";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define the variants using cva
const logoStyles = cva("h-auto", {
  variants: {
    size: {
      sm: "w-10", // Small size
      default: "w-12", // Default size
      lg: "w-16", // Large size
    },
  },
  defaultVariants: {
    size: "default", // Default variant
  },
});

// Define title and quote styles based on size
const titleStyles = cva("font-semibold", {
  variants: {
    size: {
      default: "text-3xl leading-8",
      sm: "hidden",
      lg: "text-4xl xs:text-3xl lg:text-[40px] lg:leading-9 xs:leading-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const quoteStyles = cva("font-normal", {
  variants: {
    size: {
      default: "text-xs text-stone-400 xs:leading-4 leading-0 lg:text-xs",
      sm: "hidden",
      lg: "text-md text-stone-400 xs:leading-4 leading-0 lg:text-sm",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
const Logo = ({ size = "default", className }) => {
  return (
    <Link href="/" className={cn("flex items-stretch gap-4", className)}>
      <Image
        src={"/static/images/logo.png"}
        quality={80}
        width={50}
        height={50}
        className={logoStyles({ size })}
        alt="ZERO ONE"
        priority
      />
      {size !== "icon" && (
        <div className="flex flex-col justify-end translate-y-[1.5px]">
          <h1 className={titleStyles({ size })}>ZERO ONE</h1>
          <p className={quoteStyles({ size })}>Create. Code. Conquer.</p>
        </div>
      )}
    </Link>
  );
};

export default Logo;
