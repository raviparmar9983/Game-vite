import React, { forwardRef, memo } from "react";
import { TextField, type TextFieldProps } from "@mui/material";
import { useController, useFormContext, type FieldValues, type Path, type PathValue } from "react-hook-form";

export type CustomFormTextFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  control?: any;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  label?: string;
  id?: string;
  errorMessage?: string;
} & Omit<TextFieldProps, "name" | "defaultValue" | "ref">;

const CustomFormTextFieldBase = forwardRef(function CustomFormTextField<
  TFieldValues extends FieldValues = FieldValues,
>(
  {
    name,
    control,
    defaultValue,
    label,
    id,
    errorMessage,
    ...textFieldProps
  }: CustomFormTextFieldProps<TFieldValues>,
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
    <TextField
      {...field}
      inputRef={ref}
      id={id || name}
      label={label}
      error={!!error}
      helperText={error?.message || errorMessage}
      fullWidth
      {...textFieldProps}
    />
  );
});

CustomFormTextFieldBase.displayName = "CustomFormTextField";

export const CustomFormTextField = memo(CustomFormTextFieldBase);
