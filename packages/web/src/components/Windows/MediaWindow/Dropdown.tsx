import { Accessor, createMemo, createSignal, For, Show } from "solid-js";
import clsx from "clsx";
import DropdownImage from "../../../assets/dropdown-image.png";

interface DropdownOption {
  value: string;
  display: string;
}
interface Props<T extends DropdownOption> {
  options: T[];
  value: Accessor<T["value"]>;
  onChange(value: T): void;
}

const Dropdown = <T extends DropdownOption>(props: Props<T>) => {
  const [open, setOpen] = createSignal(false);

  const selected = createMemo(
    () => props.options.find((o) => o.value === props.value())!
  );

  return (
    <>
      <button
        class="w-full flex flex-row items-stretch justify-between pl-2 p-0.5 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span>{selected().display}</span>
        <img
          src={DropdownImage}
          height="22px"
          width="22px"
          class={clsx("transform rounded-sm", open() && "rotate-180")}
        />
      </button>
      <Show when={open()}>
        <ul class="absolute l-0 r-0 border-b border-t border-gray-600 bg-gray-100 w-full box-border">
          <For each={props.options}>
            {(o) => (
              <li
                class="hover:text-white hover:bg-blue-500 px-2 py-1"
                onClick={() => {
                  props.onChange(o);
                  setOpen((o) => !o);
                }}
              >
                {o.display}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  );
};

export default Dropdown;
