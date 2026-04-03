import { Checkbox, FormControlLabel } from "@mui/material";
import { useController, useFormContext } from "react-hook-form";

type CustomCheckboxProps = {
  name: string;
  control?: any;
  label: string;
};

export function CustomCheckbox({ name, control, label }: CustomCheckboxProps) {
  const methods = useFormContext();
  const resolvedControl = control || methods.control;

  const {
    field: { value = false, onChange, ref },
  } = useController({
    name,
    control: resolvedControl,
    defaultValue: false,
  });

  return (
    <FormControlLabel
      control={
        <Checkbox inputRef={ref} checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      }
      label={label}
    />
  );
}
