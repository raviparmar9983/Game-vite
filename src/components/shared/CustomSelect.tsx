import React, { forwardRef, memo } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
 type SelectProps,
  FormHelperText,
} from "@mui/material";
import { useController, useFormContext, type FieldValues, type Path, type PathValue } from "react-hook-form";

export type Option = {
  label: string;
  value: string | number;
  icon?: React.ElementType<any>;
};

export type CustomFormSelectProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  control?: any;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  label?: string;
  id?: string;
  errorMessage?: string;
  options: Option[];
} & Omit<SelectProps, "name" | "defaultValue" | "ref" | "label">;

const CustomFormSelectBase = forwardRef(function CustomFormSelect<
  TFieldValues extends FieldValues = FieldValues,
>(
  {
    name,
    control,
    defaultValue,
    label,
    id,
    errorMessage,
    options,
    ...selectProps
  }: CustomFormSelectProps<TFieldValues>,
  ref: React.Ref<HTMLInputElement>
) {
  const methods = useFormContext<TFieldValues>();
  const resolvedControl = control || methods.control;

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control: resolvedControl,
    defaultValue,
  });

  return (
    <FormControl fullWidth error={!!error}>
      {label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
      <Select
        {...field}
        inputRef={ref}
        id={id || name}
        labelId={`${name}-label`}
        label={label}
        renderValue={(selected) => {
          const selectedOption = options.find((opt) => opt.value === selected);
          if (!selectedOption) return "";

          const Icon = selectedOption.icon;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {Icon && <Icon fontSize="small" />}
              {selectedOption.label}
            </div>
          );
        }}
        {...selectProps}
        {...selectProps}
      >
        {options.map(({ label, value, icon: Icon }) => (
          <MenuItem key={value} value={value}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {Icon && <Icon fontSize="small" />}
              {label}
            </div>
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error?.message || errorMessage}</FormHelperText>
    </FormControl>
  );
});

CustomFormSelectBase.displayName = "CustomFormSelect";

export const CustomFormSelect = memo(CustomFormSelectBase);
