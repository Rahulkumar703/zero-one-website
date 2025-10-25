"use client";
import { FaInstagram, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import Styles from "./SocialsBar.module.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ICON_SIZE = 30;

const hiddenSocialsPaths = [
  "/login",
  "/recoverPassword",
  "/setPassword",
  "/playground",
  "/practice",
];

function SocialsBarUI() {
  const pathname = usePathname();

  const socialRef = useRef();

  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => setPrevScrollY(window.scrollY), []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledDown = window.scrollY > prevScrollY;
      const scrolledUp = window.scrollY < prevScrollY;

      if (Math.abs(window.scrollY - prevScrollY) > 300) {
        setPrevScrollY(window.scrollY);

        if ((socialRef?.current && scrolledDown) || scrolledUp) {
          socialRef.current.style.right = scrolledDown ? "-300px" : "0";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  if (hiddenSocialsPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }
  return (
    <section ref={socialRef} className={Styles.socialsBar}>
      <a href="#" target="_blank" rel="noreferrer">
        <FaDiscord className={Styles.socialsBarIcons} size={ICON_SIZE} />
      </a>
      <a
        href="https://www.instagram.com/zeroonemce"
        target="_blank"
        rel="noreferrer"
      >
        <FaInstagram className={Styles.socialsBarIcons} size={ICON_SIZE} />
      </a>
      <a
        href="https://github.com/zerO-One-Official"
        target="_blank"
        rel="noreferrer"
      >
        <FaGithub className={Styles.socialsBarIcons} size={ICON_SIZE} />
      </a>
      <a
        href="https://www.linkedin.com/company/zero-one-coding-club-mce"
        target="_blank"
        rel="noreferrer"
      >
        <FaLinkedin className={Styles.socialsBarIcons} size={ICON_SIZE} />
      </a>
    </section>
  );
}

const SocialsBar = () => {
  const pathname = usePathname();
  const hiddenSocialsBar =
    pathname === "/login" ||
    pathname === "/recoverPassword" ||
    pathname.startsWith("/setPassword") ||
    pathname.startsWith("/playground");

  return hiddenSocialsBar ? null : <SocialsBarUI />;
};

export default SocialsBar;
