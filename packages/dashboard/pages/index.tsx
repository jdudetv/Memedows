import { Suspense } from "react";
import Head from "next/head";

import App from "../components/App";
import { UserProvider } from "../components/UserProvider";

const LoadingScreen = () => {
  return <div className="w-screen h-screen bg-blue-500" />;
};

const Index = () => {
  const server = !process.browser;

  if (server)
    return (
      <>
        <Head>
          <title>Memedows</title>
        </Head>
        <LoadingScreen />
      </>
    );

  return (
    <>
      <Head>
        <title>Memedows</title>
      </Head>
      <Suspense fallback={<LoadingScreen />}>
        <UserProvider>
          <App />
        </UserProvider>
      </Suspense>
    </>
  );
};

export default Index;
