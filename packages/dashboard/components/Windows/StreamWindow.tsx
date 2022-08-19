import { observer } from "mobx-react-lite";

import Window from "../Window";
import { useWindow } from "../../hooks";

const StreamWindow = observer(() => {
  const data = useWindow({
    name: "Stream",
  });

  return (
    <Window data={data} imageSrc="/camera-video.png">
      <iframe
        src={
          "https://player.twitch.tv/?channel=jdudetv&parent=" +
          window.location.hostname
        }
        height="100%"
        width="100%"
        title="Jdudetv's twitch chat window"
        allowFullScreen={false}
      ></iframe>
    </Window>
  );
});
export default StreamWindow;
