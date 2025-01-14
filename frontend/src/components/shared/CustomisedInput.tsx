import { TextField } from "@mui/material";

type Props = {
  name: string;
  type: string;
  label: string;
};

export const CustomisedInput = (props: Props) => {
  return (
    <TextField
      margin="normal"
      InputLabelProps={{ style: { color: "white" } }}
      name={props.name}
      type={props.type}
      label={props.label}
      InputProps={{
        style: {
          width: "400px",
          borderRadius: "10px",
          fontSize: "20px",
          color: "white",
        },
      }}
      required
    />
  );
};
