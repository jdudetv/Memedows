import { useEffect } from "react";
import axios from "axios";

const Redirect = () => {
  useEffect(() => {
    axios.get(
      process.env.NODE_ENV === "development"
        ? "http://localhost:5001/memedows/australia-southeast1/redirect"
        : "https://australia-southeast1-memedows.cloudfunctions.net/redirect",
      { headers: { "Referrer-Policy": "no-referrer-when-downgrade" } }
    );
  });

  return <div />;
};

export default Redirect;
