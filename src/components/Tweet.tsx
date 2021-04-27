import React, { useEffect } from "react";

export default function Tweet(props: {
  blockquoteHtml: string;
  onClickOutside: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    document.getElementsByClassName("twitter-embed")[0].appendChild(script);
  }, []);

  const handleClick = (e: any) => {
    if (ref && (ref as any).current.contains(e.target)) {
      return;
    }

    props.onClickOutside && props.onClickOutside();
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section className="twitterContainer" ref={ref}>
      <div
        className="twitter-embed"
        dangerouslySetInnerHTML={{ __html: props.blockquoteHtml }}
      />
    </section>
  );
}
