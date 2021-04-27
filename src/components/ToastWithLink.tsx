import React from "react";

export default function ToastWithLink(props: {
  link: string;
  message: string;
}) {
  return (
    <div className="overflow-hidden overflow-ellipsis">
      <div>{props.message}</div>
      <a
        className="underline whitespace-nowrap hover:text-indigo-500"
        target="blank"
        href={props.link}
      >
        {props.link}
      </a>
    </div>
  );
}
