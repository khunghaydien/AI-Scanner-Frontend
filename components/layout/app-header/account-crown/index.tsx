'use client';
import { IconCrown } from "@/components/icons";
import { IconButton, Tooltip } from "@mui/material";
export const AccountCrown = () => {
  return (
    <Tooltip title="Crown">
      <IconButton
        aria-label="Crown"
      >
        <IconCrown className="h-6 w-6" style={{ color: 'gold' }} />
      </IconButton>
    </Tooltip>
  );
};