import { observer } from "mobx-react-lite";
import { ComponentProps, FC, ReactNode, useState } from "react";
import Toggle from "~/components/ui/Toggle";
import { redemptionsStore } from "~/data/stores";
import { alertStore } from "~/data/stores/alerts";
import clsx from "clsx";
import { localDB } from "~/data/jsondb";

const Button: FC<any> = ({ className, ...props }) => {
  return (
    <button
      className={clsx(
        "px-2 py-1 font-bold rounded-md focus:outline-none hover:bg-indigo-300 focus:bg-indigo-700",
        className
      )}
      {...props}
    />
  );
};

let Amount = 0;

const alertSettings = observer(() => {
  return (
    <div className="px-2">
      <input
        type="number"
        onChange={(e) => (Amount = parseInt(e.target.value))}
        className="rounded-md text-center whitespace-nowrap text-black"
      ></input>
      <Button
        style={{ backgroundColor: "#9147ff" }}
        className="mt-2 text-white"
        onClick={() => {
          alertStore.AddNewAlert(Amount);
        }}
      >
        Create Alert
      </Button>
      <div className="flex flex-row flex-wrap justify-between px-2">
        {[...alertStore.alerts.values()]
          .sort((a, b) => a.amount - b.amount)
          .map((data) => {
            return (
              <div
                key={data.amount}
                className="rounded-md text-center flex-1 flex-col mx-2 mt-4 bg-gray-800 flex items-center space-y-2 text-xl font-semibold px-8 py-4 text-white"
              >
                <span>{data.amount}</span>
                <div className="flex items-center text-center flex-1 space-x-2">
                  <span className="-mt-0.5">exact amount</span>
                  <Toggle
                    enabled={data.exact}
                    onChange={() => (data.exact = !data.exact)}
                  />
                </div>
                <div className="flex flex-col space-y-2 items-center text-center flex-1 space-x-2">
                  <input
                    value={data.ScenePlayed}
                    onChange={(e) => (data.ScenePlayed = e.target.value)}
                    className="rounded-md text-center whitespace-nowrap text-black"
                  ></input>
                  <select
                    className="rounded-md text-center whitespace-nowrap text-black"
                    name="redemptions"
                    onChange={(e) => {
                      data.redemption = e.target.value;
                    }}
                    defaultValue={"none"}
                  >
                    <option value={data.redemption ? data.redemption : "none"}>
                      {data.redemption ? data.redemption : "Select Redemption"}
                    </option>
                    <option value="">None</option>
                    {[...redemptionsStore.redemptions.values()]
                      .sort((a, b) => a.cost - b.cost)
                      .map((r) => (
                        <option key={r.title} value={r.title}>
                          {r.title}
                        </option>
                      ))}
                  </select>

                  <select
                    className="rounded-md text-center whitespace-nowrap text-black"
                    name="redemptions"
                    onChange={(e) => {
                      data.bitVideo = e.target.value;
                    }}
                    defaultValue={"none"}
                  >
                    <option value={data.bitVideo ? data.bitVideo : "none"}>
                      {data.bitVideo ? data.bitVideo : "Bit Video"}
                    </option>
                    <option value="">None</option>
                    {[...alertStore.videos.values()].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  <select
                    className="rounded-md text-center whitespace-nowrap text-black"
                    name="redemptions"
                    onChange={(e) => {
                      data.donoVideo = e.target.value;
                    }}
                    defaultValue={"none"}
                  >
                    <option value={data.donoVideo ? data.donoVideo : "none"}>
                      {data.donoVideo ? data.donoVideo : "Dono Video"}
                    </option>
                    <option value="">None</option>
                    {[...alertStore.videos.values()].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <Button
                    style={{ backgroundColor: "#FF0000" }}
                    className="mt-2 text-white"
                    onClick={() => {
                      alertStore.RemoveAlert(data.amount);
                    }}
                  >
                    DELETE
                  </Button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
});

export default alertSettings;
