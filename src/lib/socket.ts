import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object

export const socket = io(
  "http://localhost:3005/booking?movie_show_idx=shw_hXAgC4Y2IRyPqrFN77OaKr",
  {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}` || "",
    },
  }
);
