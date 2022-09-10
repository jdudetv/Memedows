import Window from "../Window";
import Icon from "../../assets/emesene.png";

const CommandsChat = () => {
  return (
    <Window name="CommandsChat" imageSrc={Icon}>
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
};
export default CommandsChat;
