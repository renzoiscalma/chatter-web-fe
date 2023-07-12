import CheckIcon from "@mui/icons-material/Check";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/system";

interface ButtonProps {
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
  sx?: SxProps;
  onClick(): void;
  label: string;
}

export default function FormButton(props: ButtonProps): JSX.Element {
  const buttonProps: SxProps = {};

  const loadingSx: SxProps = {
    width: "24px !important",
    height: "24px !important",
    position: "absolute",
    left: "38px",
  };

  const successSx: SxProps = {
    width: "24px !important",
    height: "24px !important",
    position: "absolute",
    left: "38px",
  };

  return (
    <Button sx={{ buttonProps, ...props.sx }} onClick={props.onClick}>
      {props.loading && <CircularProgress sx={loadingSx} />}
      {props.success && <CheckIcon sx={successSx} />}
      {props.label}
    </Button>
  );
}
