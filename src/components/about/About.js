"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Button from "../button/Button";
import BottomGlitter from "../StyledText/BottomGlitter";

function About() {
  const ref = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        if (window.innerHeight + 100 > ref.current.getBoundingClientRect().y) {
          ref.current.classList.add("active");
        } else {
          ref.current.classList.remove("active");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <section
      ref={ref}
      className="container-70 mb-16 fadeonscroll sm:transform-none sm:opacity-100"
    >
      <BottomGlitter text="About Us" />
      <div className="my-6 py-2">
        <p className="text-base w-full md:w-3/4 md:text-lg sm:text-lg leading-8">
          Zero-one club is an initiative to bring together students interested
          in coding and associated skills in a peer-to-peer learning
          environment. We believe that a peer-to-peer learning environment is
          the best way to hone our skills and achieve our goals. Each member of
          the club brings their own unique vision and perspective, and we
          encourage everyone to share their ideas and experiences. Whether
          you&#39;re a seasoned developer or just starting out, we welcome you
          to join us and be a part of our community. The club is open to all
          students. The only prerequisite to join us is enthusiasm for coding
          and development, or at least curiosity towards it
        </p>
      </div>
      <Link href="/about" className="flex w-[fit-content] rounded-full">
        <Button>
          <span className="z-50 block">View More</span>
        </Button>
      </Link>
    </section>
  );
}

export default About;
