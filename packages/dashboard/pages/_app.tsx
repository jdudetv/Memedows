import "../styles/globals.css";
import { FirebaseAppProvider } from "reactfire";
import "firebase/auth";

function MyApp({ Component, pageProps }) {
  return (
    <FirebaseAppProvider
      firebaseConfig={{
        apiKey: "AIzaSyBS_U2ihP7VmI_253PbknLpgwD8ik48AXA",
        authDomain: "memedows.firebaseapp.com",
        projectId: "memedows",
        storageBucket: "memedows.appspot.com",
        messagingSenderId: "2006781696",
        appId: "1:2006781696:web:731d17b6bb9c8f267cede5",
        measurementId: "G-DSB5D9BNR3",
      }}
      suspense={true}
    >
      <Component {...pageProps} />
    </FirebaseAppProvider>
  );
}

export default MyApp;
