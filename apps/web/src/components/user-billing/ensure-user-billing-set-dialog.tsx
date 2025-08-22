import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { getUserBillingOptions, putUserBillingMutation } from "@/lib/api/@tanstack/react-query.gen";
import { Button } from "@evidentor/ui/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@evidentor/ui/components/ui/dialog";
import UpdateUserBillingForm from "./update-user-billing-form";
import { toast } from "sonner";

export default function EnsureUserBillingSetModal() {
  const [open, setOpen] = useState(true);
  const { value: skipBillingDialog, set: setSkipBillingDialog } = useLocalStorage<boolean>("billing.skip");

  const { data, isLoading } = useQuery({
    ...getUserBillingOptions({
      throwOnError: false,
    }),
    retry: false
  });

  const userBillingMutation = useMutation({
    ...putUserBillingMutation(),
    onSuccess: e => {
      setOpen(false);
      toast.info("User billing set!");
    }
  });

  const onSkipClick = () => {
    setSkipBillingDialog(true);
    setOpen(false);
  }

  if (isLoading) return;
  if (data) return;
  if (skipBillingDialog) return;

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Missing billing data</DialogTitle>
        </DialogHeader>
        <UpdateUserBillingForm onUpdate={e => {
          userBillingMutation.mutate({ body: e });
        }} />
        <DialogFooter>
          <Button onClick={onSkipClick} variant={"secondary"}>Do not show again</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}