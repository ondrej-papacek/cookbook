import { Button as MUIButton } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { LinkProps } from "react-router-dom";

type RouterButtonProps = ButtonProps & {
    to?: LinkProps["to"];
    component?: React.ElementType;
};

export function Button(props: RouterButtonProps) {
    return (
        <MUIButton
            {...props}
            sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                ...props.sx,
            }}
        />
    );
}
