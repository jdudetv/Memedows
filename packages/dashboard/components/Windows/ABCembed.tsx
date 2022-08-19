import { observer } from "mobx-react-lite";

import Window from "../Window";
import { useWindow } from "../../hooks";

const ABCWindow = observer(() => {
  const data = useWindow({
    name: "ABC",
  });

  return (
    <Window data={data} imageSrc="/emesene.png">
      <iframe
        height="100%"
        width="100%"
        src="https://www.youtube.com/embed/W1ilCy6XrmI?autoplay=1&mute=1"
        title="YouTube video player"
        allow="autoplay"
      ></iframe>
    </Window>
  );
});
export default ABCWindow;
