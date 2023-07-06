import { TextField } from "@mui/material";
import { SxProps, useTheme } from "@mui/material/styles";
import React from "react";

interface OutlinedFieldProps {
  error: boolean;
  autoComplete: string;
  id?: string;
  label: string;
  placeholder: string;
  helperText: string;
  defaultValue: string | undefined;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void;
  disabled?: boolean;
  sx?: SxProps;
}

const OutlinedField = (props: OutlinedFieldProps): JSX.Element => {
  const theme = useTheme();

  const textFieldSx: SxProps = {
    ...props.sx,
    margin: "18px 0",
    "& input.Mui-disabled": {
      WebkitTextFillColor: theme.common.text.secondary,
    },
    ".MuiInputLabel-outlined": {
      color: theme.common.text.secondary + " !important",
    },
    input: {
      color: theme.common.text.secondary,
    },
    ".Mui-error": {
      fieldset: {
        borderColor: theme.common.text.decline + " !important",
      },
    },
    fieldset: {
      borderColor: theme.textInput?.borderColor + "!important",
    },
    ".MuiFormHelperText-root": {
      margin: "0 auto",
      marginTop: "5px",
      color: theme.common.text.decline,
    },
  };

  return <TextField {...props} variant="outlined" sx={textFieldSx} />;
};

export default OutlinedField;
