"use client";

import React, { type ReactNode, forwardRef, type Ref, memo, useMemo } from "react";
import { Dialog, type DialogProps, Slide, Fade, Grow, Box,type Breakpoint } from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";

type AnimationType = "fade" | "slide" | "grow" | "none";
type Anchor = "top" | "bottom" | "left" | "right" | "center";

interface CustomModalProps extends Omit<DialogProps, "TransitionComponent"> {
  open: boolean;
  onClose?: () => void;
  animation?: AnimationType;
  anchor?: Anchor;
  size?: Breakpoint;
  children: ReactNode;
}

const getTransition = (animation: AnimationType) => {
  switch (animation) {
    case "slide":
      return forwardRef(function Transition(
        props: TransitionProps & { children: React.ReactElement },
        ref: Ref<unknown>
      ) {
        return <Slide direction="left" ref={ref} {...props} />;
      });
    case "fade":
      return forwardRef(function Transition(
        props: TransitionProps & { children: React.ReactElement },
        ref: Ref<unknown>
      ) {
        return <Fade ref={ref} {...props} />;
      });
    case "grow":
      return forwardRef(function Transition(
        props: TransitionProps & { children: React.ReactElement },
        ref: Ref<unknown>
      ) {
        return <Grow ref={ref} {...props} />;
      });
    default:
      return undefined;
  }
};

const anchorStyleMap: Record<Anchor, React.CSSProperties> = {
  top: { alignItems: "flex-start", justifyContent: "center" },
  bottom: { alignItems: "flex-end", justifyContent: "center" },
  left: { alignItems: "center", justifyContent: "flex-start" },
  right: { alignItems: "center", justifyContent: "flex-end" },
  center: { alignItems: "center", justifyContent: "center" },
};

const CustomModal = memo(
  forwardRef<HTMLDivElement, CustomModalProps>(function CustomModal(
    { open, onClose, animation = "fade", anchor = "center", size = "md", children, ...rest },
    ref
  ) {
    const Transition = useMemo(() => getTransition(animation), [animation]);

    // Forward ref to the dialog's container
    // useImperativeHandle(ref, () => {
    // Optionally expose dialog methods here
    // return {};
    // });

    return (
      <Dialog
        ref={ref}
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth={size}
        PaperProps={{
          sx: {
            borderRadius: 1,
            p: 2,
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            display: "flex",
            ...anchorStyleMap[anchor],
          },
        }}
        {...rest}
      >
        <Box>{children}</Box>
      </Dialog>
    );
  })
);

export { CustomModal };
