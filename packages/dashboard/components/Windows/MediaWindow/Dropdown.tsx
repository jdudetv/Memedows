import clsx from "clsx";
import { useState } from "react";

interface Props {
  options: { value: string; display: string }[];
  value: { value: string; display: string };
  onChange(value: { value: string; display: string }): void;
}
const Dropdown = ({ options, value, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="w-full flex flex-row items-stretch justify-between pl-2 p-0.5 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span>{value.display}</span>
        <img
          src="/dropdown-image.png"
          height="22px"
          width="22px"
          className={clsx("transform rounded-sm", open && "rotate-180")}
        />
      </button>
      {open && (
        <ul className="absolute l-0 r-0 border-b border-t border-gray-600 bg-gray-100 w-full box-border">
          {options.map((o) => (
            <li
              className="hover:text-white hover:bg-blue-500 px-2 py-1"
              key={o.value}
              onClick={() => {
                onChange(o);
                setOpen(!open);
              }}
            >
              {o.display}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Dropdown;
