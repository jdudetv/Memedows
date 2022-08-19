import { observer } from "mobx-react-lite";

import Window from "../Window";
import { useWindow } from "../../hooks";

const CommandsChat = observer(() => {
  const data = useWindow({
    name: "CommandsChat",
  });

  return (
    <Window data={data} imageSrc="/emesene.png">
      <iframe
        src={
          "https://www.twitch.tv/embed/ocefam/chat?parent=" +
          window.location.hostname +
          "&darkpopout"
        }
        height="100%"
        width="100%"
        title="Jdudetv's twitch chat window"
      ></iframe>
    </Window>
  );
});
export default CommandsChat;
