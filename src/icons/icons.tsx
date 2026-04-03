import { SvgIcon, type SvgIconProps } from "@mui/material";

// Copy Icon
export const CopyIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 18H8V7h11v16z"
    />
  </SvgIcon>
);

// Game Icon (example: dice)
export const GameIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-8 14a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm6-6a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm-6-6a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm-6 6a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3z"
    />
  </SvgIcon>
);

// Profile Icon (user)
export const ProfileIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    />
  </SvgIcon>
);
