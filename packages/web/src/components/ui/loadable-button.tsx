import { ComponentPropsWithRef } from "react";

import { LoaderIcon } from "lucide-react";
import { Button } from "./button";

type LoadableButtonProps = ComponentPropsWithRef<typeof Button> & {
  loading?: boolean;
};

export default function LoadableButton(props: LoadableButtonProps) {
  return (
    <Button {...props} disabled={props.disabled || props.loading}>
      {props.loading ? <LoaderIcon className="animate-spin" /> : props.children}
    </Button>
  );
}
