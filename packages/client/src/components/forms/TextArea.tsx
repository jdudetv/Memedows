import { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Props
  extends Exclude<ComponentProps<"textarea">, "name" | "onChange" | "value"> {
  name: string;
}

const TextArea = ({ name, ...props }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <textarea {...props} onChange={onChange} value={value} />
      )}
    />
  );
};

export default TextArea;
