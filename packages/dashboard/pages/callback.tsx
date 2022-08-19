import axios from "axios";
import { useEffect } from "react";

const Callback = () => {
  useEffect(() => {
    const task = async () => {
      const queryString = window.location.search;

      const params = new URLSearchParams(queryString);

      const { data } = await axios.get(
        process.env.NODE_ENV === "development"
          ? "http://localhost:5001/memedows/australia-southeast1/callback"
          : "https://australia-southeast1-memedows.cloudfunctions.net/callback",
        {
          params: {
            code: params.get("code"),
            state: params.get("state"),
          },
          withCredentials: true,
        }
      );

      if (window.opener) window.opener.postMessage(data, "*");
    };
    task();
  }, []);

  return <p>Please Wait...</p>;
};

export default Callback;
