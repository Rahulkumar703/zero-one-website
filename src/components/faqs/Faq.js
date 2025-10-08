"use client";
import { BsChevronRight } from "react-icons/bs";
import styles from "@/styles/faq.module.css";
import { useState } from "react";
import Markdown from "../markdown/Markdown";

const Faq = ({ _id, question, answer, index }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (activeIndex == index) setActiveIndex(null);
    else setActiveIndex(index);
  };

  return (
    <div className={styles.item} key={_id}>
      <button
        type="button"
        className={`${styles.title}`}
        onClick={() => toggleFAQ(index)}
      >
        <h2 className="text-2xl text-left sm:text-xl">{question}</h2>
        <BsChevronRight
          className={`ml-4 w-8 shrink-0 ${
            activeIndex === index ? "rotate-90" : "rotate-0"
          }`}
        />
      </button>
      <div
        className={`${styles.body} ${
          activeIndex == index ? "visible" : "hidden"
        }`}
      >
        <Markdown>{answer}</Markdown>
      </div>
    </div>
  );
};

export default Faq;
