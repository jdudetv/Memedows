import { lazy } from "react";
import "./setup";
import { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { initialize } from "./data";
import usePromise from "react-promise-suspense";

const App = lazy(() => import("./App"));

const Index = () => {
  usePromise(initialize, []);

  return <App />;
};

const Loading = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-800">
      <span className="text-4xl text-white">Initializing...</span>
    </div>
  );
};

ReactDOM.render(
  <Suspense fallback={<Loading />}>
    <Index />
  </Suspense>,
  document.getElementById("root")
);
