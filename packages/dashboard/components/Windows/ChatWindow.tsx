import { observer } from "mobx-react-lite";

import Window from "../Window";
import { useWindow } from "../../hooks";

const ChatWindow = observer(() => {
  const data = useWindow({
    name: "Chat",
  });

  return (
    <Window data={data} imageSrc="/emesene.png">
      <iframe
        src={
          "https://www.twitch.tv/embed/jdudetv/chat?parent=" +
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
export default ChatWindow;
