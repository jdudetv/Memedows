import { useUser } from "../components/UserProvider";

const AuthCheck = ({ children, fallback }: any) => {
  const u = useUser();

  return u ? children : <>{fallback}</>;
};

export default AuthCheck;
