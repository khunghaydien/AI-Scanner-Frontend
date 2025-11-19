import { Typography } from "@mui/material";
import React from "react";
import clsx from "clsx";
export type ButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className: string;
}

export const CommonButton = ({ icon, label, onClick, className }: ButtonProps) => {
    return (
        <div className={clsx("flex flex-col items-center justify-center flex-1 cursor-pointer", className)}
            onClick={onClick}
        >
            {icon && icon}
            {label && <Typography variant="body2" className="text-sm">
                {label}
            </Typography>}
        </div >
    );
};