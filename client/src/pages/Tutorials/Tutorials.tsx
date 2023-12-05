import YouTube from "react-youtube";
import "./Tutorials.css";
const Tutorials = () => {
  const opts = {
    height: "480", // Adjust the height to your desired value
    width: "800", // Adjust the width to your desired value
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  return (
    <div className="tutorials">
      <div className="title">Tutorial Video</div>
      <YouTube className="video" videoId="vxZAHIeJ14c" opts={opts} />
    </div>
  );
};

export default Tutorials;
