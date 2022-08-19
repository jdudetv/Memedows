import { ComponentProps, FC, ReactNode, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import hsl from "hsl-to-hex";

import { redemptionsStore } from "~/data/stores/redemptions";
import { ProvisionalRedemption, Redemption } from "~/data/services/twitchApi";
import FormToggle from "~/components/forms/Toggle";
import Form from "~/components/forms/Form";
import Input, { InputProps } from "~/components/forms/Input";
import TextArea from "~/components/forms/TextArea";
import Toggle from "~/components/ui/Toggle";
import { localDB } from "~/data/jsondb";

function costToHex(number: number) {
  let hue = Math.pow(number / 10000, 0.165) * 360;
  return hsl(361 - (hue % 360), 100, 50).toUpperCase();
}

function commaSeparateNumber(val: number | string) {
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return val;
}

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

const OptionRow = ({
  label,
  children,
}: {
  label: ReactNode;
  children: any;
}) => {
  return (
    <div className="flex flex-row space-x-2 items-center">
      <label className="flex-1">{label}</label>
      {children}
    </div>
  );
};

const StyledInput = ({ className, ...props }: InputProps) => (
  <Input
    className={clsx(
      "bg-black bg-opacity-20 rounded-md outline-none w-16",
      className
    )}
    {...props}
  />
);

const RedemptionButton = ({
  defaultRedemption,
  handleClose,
}: {
  defaultRedemption?: Redemption;
  handleClose: () => void;
}) => {
  const form = useForm<ProvisionalRedemption>({
    defaultValues: {
      cost: 1,
      timer: 0,
      count: 0,
      ...defaultRedemption,
    },
  });

  const submitRedemption = async (data: ProvisionalRedemption) => {
    if (defaultRedemption) {
      data.background_color = costToHex(data.cost);
      const defaultCost = parseInt(data.defaultcost as any);
      data.cost = defaultCost;
      data.defaultcost = defaultCost;
      console.log(data);
      data.count = 0;
      data.timer = 0;
      await redemptionsStore.updateRedemption(data);
    } else {
      data.background_color = costToHex(data.cost);
      data.defaultcost = parseInt(data.cost as any);
      await redemptionsStore.createRedemption(data);
    }

    handleClose();
  };

  return (
    <>
      <div className="relative mx-auto my-auto" style={{ width: "32rem" }}>
        <Form
          form={form}
          onSubmit={submitRedemption}
          className="border border-black p-4 space-y-4 rounded-md text-white text-left leading-7"
          style={{
            backgroundColor: defaultRedemption
              ? costToHex(defaultRedemption.cost)
              : "#202020",
          }}
        >
          <div className="flex flex-col rounded-md bg-black bg-opacity-30 p-2 space-y-1">
            {defaultRedemption ? (
              <span className="font-bold text-2xl pl-2 col-span-10">
                {defaultRedemption.title}
              </span>
            ) : (
              <label className="pl-2 col-span-10">Title*</label>
            )}
            {!defaultRedemption && (
              <Input
                className="bg-black bg-opacity-20 rounded-md py-1 mx-2 outline-none"
                required
                maxLength={45}
                readOnly={defaultRedemption != undefined}
                name="title"
              />
            )}

            <div className="flex flex-col">
              <label>cost</label>
              <Input
                className="bg-black bg-opacity-20 rounded-md py-1 pl-2 outline-none"
                required
                min={1}
                type="number"
                name={defaultRedemption ? "defaultcost" : "cost"}
              />
            </div>

            <div className="flex flex-col">
              <label>Description</label>
              <TextArea
                className="bg-black bg-opacity-20 rounded-md py-1 pl-2 outline-none"
                rows={6}
                maxLength={200}
                name="prompt"
              />
            </div>

            <OptionRow label="Require viewer to enter text">
              <FormToggle name="is_user_input_required" />
            </OptionRow>

            <OptionRow label="Max redemptions per stream">
              <StyledInput
                type="number"
                name="max_per_stream_setting.max_per_stream"
              />
              <FormToggle name="max_per_stream_setting.is_enabled" />
            </OptionRow>

            <OptionRow
              label={
                <>
                  Max redemptions <b>per user</b> per stream
                </>
              }
            >
              <StyledInput
                type="number"
                name="max_per_user_per_stream_setting.max_per_user_per_stream"
              />
              <FormToggle name="max_per_user_per_stream_setting.is_enabled" />
            </OptionRow>

            <OptionRow label="Global cooldown">
              <StyledInput
                type="number"
                name="global_cooldown_setting.global_cooldown_seconds"
              />
              <FormToggle name="global_cooldown_setting.is_enabled" />
            </OptionRow>

            <OptionRow label="Skip rewards requests queue">
              <FormToggle name="should_redemptions_skip_request_queue" />
            </OptionRow>
          </div>

          <Button
            style={{ backgroundColor: "#9147ff" }}
            className="text-white text-center"
            type="submit"
          >
            {defaultRedemption ? "Edit" : "Create"}
          </Button>
          {defaultRedemption && (
            <Button
              style={{ backgroundColor: "#ff0000" }}
              className="text-white text-center ml-2"
              onClick={() =>
                redemptionsStore.deleteRedemption(
                  defaultRedemption.title as any
                )
              }
            >
              {defaultRedemption && "DELETE"}
            </Button>
          )}
        </Form>
      </div>
    </>
  );
};

const GroupButton = ({ handleClose }: { handleClose: () => void }) => {
  const form = useForm<{ name: string }>({
    defaultValues: {
      name: "",
    },
  });

  const submitRedemption = async (data: { name: string }) => {
    if (!localDB.exists(`store/groups/${data.name}`)) {
      localDB.push(`store/groups/${data.name}`, {
        items: [],
        disableRedemptions: false,
        deleteRedemptions: false,
      });
    }
    handleClose();
  };

  return (
    <>
      <div className="relative mx-auto my-auto" style={{ width: "32rem" }}>
        <Form
          form={form}
          onSubmit={submitRedemption}
          className="border border-black p-4 space-y-4 rounded-md text-white text-left leading-7"
          style={{ backgroundColor: "#202020" }}
        >
          <div className="flex flex-col rounded-md bg-black bg-opacity-30 p-2 space-y-1">
            <label className="pl-2 col-span-10">Name</label>
            <Input
              className="bg-black bg-opacity-20 rounded-md py-1 mx-2 outline-none"
              required
              maxLength={45}
              name="name"
            />
            <Button
              style={{ backgroundColor: "#9147ff" }}
              className="text-white text-center"
              type="submit"
            >
              Create Group
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

const Redemptions = observer(() => {
  const [openDialog, setOpenDialog] = useState<string | false>(false);
  const [redemption, editRedemption] = useState<Redemption | undefined>(
    undefined
  );

  const [selectedRedemption, setSelectedRedemption] = useState<string | false>(
    false
  );
  const groups = localDB.getData("store/groups");
  const groupKeys = Object.keys(groups) as string[];
  const [group, setGroup] = useState(groupKeys[0]);

  return (
    <>
      <div className="px-2">
        <Button
          style={{ backgroundColor: "#9147ff" }}
          className="mt-2 text-white"
          onClick={() => {
            editRedemption(undefined);
            setOpenDialog("redemption");
          }}
        >
          Create Redemption
        </Button>

        <Button
          style={{ backgroundColor: "#9147ff" }}
          className="mt-2 text-white"
          onClick={() => {
            editRedemption(undefined);
            setOpenDialog("group");
          }}
        >
          Create Group
        </Button>
        {group !== "All" && (
          <Button
            style={{ backgroundColor: "#ff0000" }}
            className="mt-2 text-white"
            onClick={() => {
              console.log(group);
              localDB.delete(`store/groups/${group}`);
              setGroup("All");
            }}
          >
            Delete Group
          </Button>
        )}

        <ul className="flex border-b">
          {groupKeys.map((g) => (
            <li className="-mb-px mr-1" key={g}>
              <a
                style={{
                  backgroundColor:
                    g === "All"
                      ? "#404040"
                      : groups[g].deleteRedemptions === false
                      ? "#404040"
                      : "#FF0000",
                }}
                className={clsx(
                  "bg-green inline-block py-2 px-4 text-white font-semibold",
                  group === g && "border-l border-t border-r rounded-t"
                )}
                onClick={() => setGroup(g)}
              >
                {g}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Dialog
        open={openDialog !== false}
        onClose={() => setOpenDialog(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex mx-auto min-h-screen">
          <Dialog.Overlay
            className="fixed inset-0 bg-black opacity-30"
            onClick={() => setOpenDialog(false)}
          />
          {openDialog === "redemption" && (
            <RedemptionButton
              defaultRedemption={redemption}
              handleClose={() => {
                setOpenDialog(false);
                editRedemption(undefined);
              }}
            />
          )}
          {openDialog === "group" && (
            <GroupButton
              handleClose={() => {
                setOpenDialog(false);
              }}
            />
          )}
        </div>
      </Dialog>

      <div>
        {group !== "All" && (
          <>
            <div>
              <select
                name="redemptions"
                onChange={(e) =>
                  setSelectedRedemption(
                    e.target.value == "none" ? false : e.target.value
                  )
                }
                defaultValue={"none"}
              >
                <option value="none">Click Here</option>
                {[...redemptionsStore.redemptions.values()]
                  .sort((a, b) => a.cost - b.cost)
                  .filter(
                    (r) =>
                      group === groupKeys[0] ||
                      !groups[group].items.includes(r.title)
                  )
                  .map((r) => (
                    <option key={r.title} value={r.title}>
                      {r.title}
                    </option>
                  ))}
              </select>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={selectedRedemption == false}
                onClick={(e) => {
                  const data = localDB.getData(`store/groups/${group}/items`);
                  data.push(selectedRedemption);
                  localDB.push(`store/groups/${group}/items`, data);
                  setSelectedRedemption(false);
                }}
              >
                Submit
              </button>
              <Toggle
                enabled={groups[group].deleteRedemptions}
                onChange={async (e) => {
                  const disableRedemption = e;
                  localDB.push(
                    `store/groups/${group}/deleteRedemptions`,
                    disableRedemption
                  );
                  await redemptionsStore.toggleRedemptions(
                    groups[group].items,
                    !disableRedemption
                  );
                }}
              />
            </div>
          </>
        )}
        <div>
          <label className="switch">
            <input
              type="checkbox"
              defaultChecked={groups[group].disableRedemptions}
              onChange={async (e) => {
                const disableRedemption = !groups[group].disableRedemptions;
                localDB.push(
                  `store/groups/${group}/disableRedemptions`,
                  disableRedemption
                );
                if (group == "All") {
                  await redemptionsStore.toggleRedemptions(
                    [...redemptionsStore.redemptions.values()].map(
                      (r) => r.title
                    ),
                    disableRedemption,
                    false
                  );
                } else {
                  await redemptionsStore.toggleRedemptions(
                    groups[group].items,
                    disableRedemption,
                    false
                  );
                }
              }}
            />
            Pause All
          </label>
        </div>
      </div>

      <div className="flex flex-row flex-wrap justify-between px-2">
        {[...redemptionsStore.redemptions.values()]
          .sort((a, b) => a.cost - b.cost)
          .filter(
            (r) =>
              group === groupKeys[0] || groups[group].items.includes(r.title)
          )
          .map((redemption) => (
            <div
              key={redemption.title}
              className="rounded-md text-center whitespace-nowrap flex-1 mx-2 mt-2 bg-gray-900 flex flex-col items-center space-y-1 text-xl font-semibold px-8 py-4 text-white"
              style={{ backgroundColor: costToHex(redemption.cost) }}
            >
              {group !== "All" && (
                <button
                  className="right bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded"
                  onClick={(e) => {
                    const data = localDB.getData(`store/groups/${group}/items`);
                    const index = data.findIndex((d) => d === redemption.title);
                    if (index !== -1) data.splice(index, 1);
                    localDB.push(`store/groups/${group}/items`, data);
                    // console.log(data.);
                    // localDB.push(`store/groups/${group}/items`, data);
                  }}
                >
                  X
                </button>
              )}
              <span
                className="hover:text-gray-300 cursor-pointer bg-gray-700 bg-opacity-50 rounded-md px-2 flex flex-col font-black"
                onClick={() => {
                  editRedemption(redemption);
                  setOpenDialog("redemption");
                }}
              >
                {redemption.title}
              </span>
              <span
                className="hover:text-gray-300 cursor-pointer bg-gray-700 bg-opacity-50 rounded-md px-2"
                onClick={() => {
                  editRedemption(redemption);
                  setOpenDialog("redemption");
                }}
              >
                {commaSeparateNumber(redemption.cost)}
              </span>
              <Toggle
                enabled={redemption.enabled}
                onChange={(e) => {
                  redemption.toggle = 0;
                  redemptionsStore.toggleRedemption(redemption.title, e);
                }}
              />
            </div>
          ))}
      </div>
    </>
  );
});

export default Redemptions;
