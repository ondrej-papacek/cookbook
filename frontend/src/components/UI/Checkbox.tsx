import { Checkbox as MUICheckbox, FormControlLabel } from "@mui/material";
import type { CheckboxProps } from "@mui/material";

type Props = CheckboxProps & {
    label: string;
};

export function Checkbox({ label, ...props }: Props) {
    return (
        <FormControlLabel
            control={<MUICheckbox {...props} size="small" />}
            label={label}
        />
    );
}