import Window from "../Window";
import Icon from "../../assets/emesene.png";

export default () => {
  return (
    <Window name="Chat" imageSrc={Icon}>
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
};
