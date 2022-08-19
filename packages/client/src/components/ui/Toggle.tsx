import { ComponentProps } from "react";
import { Switch } from "@headlessui/react";
import clsx from "clsx";

interface Props extends Omit<ComponentProps<"button">, "onChange"> {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

const Toggle = ({ enabled, onChange, className }: Props) => {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={clsx(
        enabled ? "bg-indigo-600" : "bg-gray-200 bg-opacity-70",
        "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        className
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={clsx(
          enabled ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
        )}
      />
    </Switch>
  );
};

export default Toggle;
