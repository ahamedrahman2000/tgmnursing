 
import VideoSection from "../components/VideoSection";

const VideoPage = () => {
  const videos = [
    "https://www.youtube.com/embed/tgbNymZ7vqY",
    "https://www.youtube.com/embed/dQw4w9WgXcQ"
  ];

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Our Videos
      </h1>

      <VideoSection videos={videos} />

    </div>
  );
};

export default VideoPage;