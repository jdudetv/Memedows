import { Show } from "solid-js";
import { createQuery } from "../../utils/trpc";

const PublicStats = () => {
  const stats = createQuery(["joshStats"]);

  return (
    <div class="w-full h-full flex flex-col space-y-2 px-4 py-5 text-color-[#28386d]">
      <Show when={stats.data}>
        {(stats) => (
          <>
            <span>
              Pushups: {stats.pushupsCompleted}/{stats.pushupsTotal}
            </span>
            <span>
              Squats: {stats.squatsCompleted}/{stats.squatsTotal}
            </span>
          </>
        )}
      </Show>
    </div>
  );
};

export default PublicStats;
