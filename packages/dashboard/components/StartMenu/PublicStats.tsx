import { usePublicStats } from "../../hooks";

const PublicStats = () => {
  const publicStats = usePublicStats();

  return (
    <div
      className="w-full h-full flex flex-col space-y-2 px-4 py-5"
      style={{ color: "#28386d" }}
    >
      <span>
        Pushups: {publicStats.pushups.completed}/{publicStats.pushups.total}
      </span>
      <span>
        Squats: {publicStats.squats.completed}/{publicStats.squats.total}
      </span>
    </div>
  );
};

export default PublicStats;
