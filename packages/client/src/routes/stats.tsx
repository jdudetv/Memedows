import { useEffect, useState } from "react";
import { redemptionsStore } from "~/data/stores";

const stats = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((s) => s + 1), 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col">
      {[...redemptionsStore.redemptions.values()]
        .filter((r) => r.uses !== undefined)
        .sort((a, b) => b.uses - a.uses)
        .map((stats) => (
          <div className="font-bold text-2xl" key={stats.title}>
            {stats.title}: {stats.uses}
          </div>
        ))}
    </div>
  );
};

export default stats;
