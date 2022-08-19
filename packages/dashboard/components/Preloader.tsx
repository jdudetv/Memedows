import { useUser } from "./UserProvider";

const Preloader = () => {
  useUser();
  return (
    <>
      <img src="/StartMenu.png" className="w-0 h-0 hidden" />
      <img src="/MainPageBackground_Bliss.jpg" className="w-0 h-0 hidden" />
    </>
  );
};

export default Preloader;
