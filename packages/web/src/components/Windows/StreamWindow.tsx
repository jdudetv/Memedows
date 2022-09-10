import Window from "../Window";
import Icon from "../../assets/camera-video.png";

export default () => {
  return (
    <Window name="Stream" imageSrc={Icon}>
      <iframe
        src={
          "https://player.twitch.tv/?channel=jdudetv&parent=" +
          window.location.hostname
        }
        height="100%"
        width="100%"
        title="Jdudetv's twitch chat window"
        allowfullscreen={false}
      ></iframe>
    </Window>
  );
};
