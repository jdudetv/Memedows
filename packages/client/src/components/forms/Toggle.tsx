import { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";

import ToggleBase from "../ui/Toggle";

interface Props extends ComponentProps<"button"> {
  name: string;
}

const Toggle = ({ name, ...props }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <ToggleBase {...props} onChange={onChange} enabled={value} />
      )}
    />
  );
};

export default Toggle;
