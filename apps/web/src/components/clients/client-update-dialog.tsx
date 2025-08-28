import { Client } from "@/lib/api";
import { patchClientsByIdMutation } from "@/lib/api/@tanstack/react-query.gen";
import { Dialog, DialogContent } from "@evidentor/ui/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClientForm, CreateClient } from "./client-form";

interface ClientUpdateDialogProps {
  client?: Client;
  onClose?: () => void;
  onUpdate?: (newClient: Client) => void;
}
export default function ClientUpdateDialog({ client, onClose, onUpdate }: ClientUpdateDialogProps) {

  const updateClientMutation = useMutation({
    ...patchClientsByIdMutation(),
    onSuccess: (c) => {
      toast.info("Client updated");
      onUpdate?.(c);
    }
  });

  const handleSubmit = (newClient: CreateClient) => {
    if(!client) return;

    updateClientMutation.mutate({
      body: newClient,
      path: { id: client.id }
    });
  }

  return (
    <Dialog open={!!client} onOpenChange={onClose}>
      <DialogContent>
        {
          client && (
            <ClientForm client={{
              ...client,
              address: client.address ?? undefined,
            }}
              onSubmit={handleSubmit}
            />
          )
        }
      </DialogContent>
    </Dialog>
  );
}