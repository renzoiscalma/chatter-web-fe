import { Box, Modal, SxProps, Typography, useTheme } from "@mui/material";

interface ModalBaseProps {
  open: boolean;
  onClose(): void;
  children: React.ReactNode;
  header: string;
}

const ModalBase = ({
  open,
  onClose,
  children,
  header,
}: ModalBaseProps): JSX.Element => {
  const theme = useTheme();

  const style: SxProps = {
    display: "flex",
    flexDirection: "column",
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "26px",
    width: 400,
    bgcolor: theme.modal?.bgColor,
    boxShadow: 24,
    px: 4,
    py: 2,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          textAlign="center"
          color={theme.common.text.secondary}
        >
          {header}
        </Typography>
        {children}
      </Box>
    </Modal>
  );
};

export default ModalBase;
