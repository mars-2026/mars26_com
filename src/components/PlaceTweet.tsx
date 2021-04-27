import React from "react";

export default function PlaceTweet(props: {
  accountScreenName: string;
  screenshotDataUrl: string;
  onClickPostTweet: (message: string) => void;
  onClickLogout: () => void;
  postStatus: string;
  onClickOutside: () => void;
}) {
  const [message, setMessage] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: any) => {
    if (ref && (ref as any).current.contains(e.target)) {
      return;
    }

    props.onClickOutside && props.onClickOutside();
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClickPostTweet = () => {
    props.onClickPostTweet(message);
  };

  return (
    <div
      ref={ref}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
    >
      <div
        className="bg-black bg-opacity-75 text-white
        w-96 rounded-md -ml-48 p-8 flex flex-col -mt-32"
      >
        <div className="flex flex-row justify-between">
          <div className="">@{props.accountScreenName}</div>
          <button
            className="border px-2 rounded-md"
            onClick={props.onClickLogout}
          >
            Logout
          </button>
        </div>
        <textarea
          className="bg-black text-white rounded-md p-2 mt-4"
          placeholder="Tell the world!"
          rows={1}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <img
          className="rounded-md mt-8"
          src={props.screenshotDataUrl}
          alt="mars screenshot"
        />
        <button
          className="border mt-8 py-2 rounded-md 
        hover:text-indigo-500 hover:border-indigo-500"
          onClick={handleClickPostTweet}
          disabled={props.postStatus === "pending"}
        >
          Post Tweet
        </button>
      </div>
    </div>
  );
}
