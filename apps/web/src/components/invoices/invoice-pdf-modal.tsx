import { DocumentViewer } from 'react-documents';
import { Invoice } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@evidentor/ui/components/ui/dialog";
import { client } from '@/lib/api/client.gen';

interface InvoicePdfModalProps {
  invoice: Invoice,
  open: boolean,
  onOpenChange: (newOpen: boolean) => void;
}

export default function InvoicePdfModal(props: InvoicePdfModalProps) {
  const url = client.buildUrl({ url: `invoices/${props.invoice.id}/generated`, baseUrl: client.getConfig().baseUrl });
  // No generated file id
  if (!props.invoice.generatedFileId) return;
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className='w-[90vw]! max-w-[90vw]! h-[90vh]! max-h-[90vh]! flex flex-col'>
      <DialogHeader>
        <DialogTitle>PDF</DialogTitle>
      </DialogHeader>
        <DocumentViewer url={url} viewer='url' />
      </DialogContent>
    </Dialog>
  );
}