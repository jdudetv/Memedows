import { useEffect, useState } from "react";
import { sceneItems, world } from "~/obs/physics";

const PhysicsWorld = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((s) => s + 1), 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col font-bold text-2xl">
      <div>Total Physics Items: {sceneItems.size}</div>
      {[...sceneItems.entries()].map(([item, physics]) => (
        <div className="font-bold text-2xl" key={physics.body.id}>
          {item.source.name}
        </div>
      ))}
    </div>
  );
};

export default PhysicsWorld;
