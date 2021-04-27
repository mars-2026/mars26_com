import React from "react";

import marsGlobe from "../images/mars100px.png";

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="py-2 sticky top-0 z-10 h-20 -mt-20">
      <div
        className="
        flex flex-row items-center px-2 mx-auto tracking-wider
         justify-between py-6 text-gray-200 sticky top-0 z-10 h-20
        -mt-20"
      >
        <div className="flex flex-row mx-auto space-x-2">
          <a
            href="https://discord.gg/SyQEzJHqS2"
            rel="noopener noreferrer"
            target="_blank"
            className="p-1 text-white transition-colors duration-200 rounded-full hover:text-purple-500 focus:outline-none "
          >
            <span className="sr-only">Discord</span>
            <svg width="18" height="18" viewBox="0 0 64 64" fill="currentColor">
              <path d="M37.922 26.852c-1.84 0-3.292 1.58-3.292 3.55s1.485 3.55 3.292 3.55c1.84 0 3.292-1.58 3.292-3.55s-1.485-3.55-3.292-3.55zm-11.78 0c-1.84 0-3.292 1.58-3.292 3.55s1.485 3.55 3.292 3.55c1.84 0 3.292-1.58 3.292-3.55.032-1.97-1.452-3.55-3.292-3.55zM53.608 0H10.36a6.63 6.63 0 0 0-6.616 6.616v43.248a6.63 6.63 0 0 0 6.616 6.616h36.6l-1.7-5.906 4.13 3.808 3.905 3.582L60.256 64V6.616C60.224 2.97 57.255 0 53.608 0zM41.15 41.795l-2.13-2.582c4.228-1.194 5.842-3.808 5.842-3.808-1.323.87-2.582 1.485-3.712 1.904-1.614.678-3.163 1.097-4.68 1.388-3.098.58-5.938.42-8.36-.032-1.84-.355-3.42-.84-4.744-1.388-.742-.3-1.55-.645-2.356-1.097-.097-.065-.194-.097-.3-.16-.065-.032-.097-.065-.13-.065l-.904-.55s1.55 2.55 5.648 3.776l-2.162 2.646c-7.133-.226-9.844-4.873-9.844-4.873 0-10.296 4.648-18.655 4.648-18.655 4.648-3.453 9.037-3.357 9.037-3.357l.323.387c-5.8 1.646-8.456 4.196-8.456 4.196s.7-.387 1.904-.904c3.453-1.517 6.197-1.904 7.326-2.033.194-.032.355-.065.55-.065a27.31 27.31 0 0 1 6.519-.065 26.86 26.86 0 0 1 9.715 3.066s-2.55-2.42-8.036-4.067l.452-.516s4.422-.097 9.037 3.357c0 0 4.648 8.36 4.648 18.655 0-.032-2.7 4.615-9.844 4.84z" />
            </svg>
          </a>
          <NavLink className="" to="/">
            <img
              className="h-6 w-6 hover:animate-pulse"
              src={marsGlobe}
              alt="logo"
            />
          </NavLink>
          <a
            href="https://twitter.com/marstwentysix"
            rel="noopener noreferrer"
            target="_blank"
            className="p-1 text-white transition-colors duration-200 rounded-full hover:text-blue-400 focus:outline-none "
          >
            <span className="sr-only">Twitter</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 256 209"
              fill="currentColor"
            >
              <path d="M80.507 208.013c96.604 0 149.442-80.036 149.442-149.442 0-2.274 0-4.537-.153-6.8A106.865 106.865 0 0 0 256 24.595a104.837 104.837 0 0 1-30.167 8.264 52.705 52.705 0 0 0 23.091-29.05 105.257 105.257 0 0 1-33.352 12.748 52.572 52.572 0 0 0-89.507 47.903A149.115 149.115 0 0 1 17.818 9.583a52.562 52.562 0 0 0 16.26 70.113 52.132 52.132 0 0 1-23.838-6.574v.665a52.541 52.541 0 0 0 42.138 51.487 52.439 52.439 0 0 1-23.716.901 52.582 52.582 0 0 0 49.07 36.475 105.39 105.39 0 0 1-65.229 22.528A106.916 106.916 0 0 1 0 184.42a148.695 148.695 0 0 0 80.507 23.552" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
