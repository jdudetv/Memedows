import { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface InputProps
  extends Exclude<ComponentProps<"input">, "name" | "onChange" | "value"> {
  name: string;
}

const Input = ({ name, ...props }: InputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <input {...props} onChange={onChange} value={value} />
      )}
    />
  );
};

export default Input;
