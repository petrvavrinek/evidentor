import { Client } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@evidentor/ui/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { Badge } from "@evidentor/ui/components/ui/badge";
import { Separator } from "@evidentor/ui/components/ui/separator";
import { Building2, User, Mail, MapPin, CreditCard } from "lucide-react";

interface ClientDetailDialogProps {
  client?: Client;
  onClose?: () => void;
}

export default function ClientDetailDialog({ client, onClose }: ClientDetailDialogProps) {
  return (
    <Dialog open={!!client} onOpenChange={e => !e && onClose?.()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Client Details
          </DialogTitle>
        </DialogHeader>

        {client && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-4 w-4" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                    <p className="text-base font-medium">{client.companyName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{client.contactName}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {client.email ? (
                      <a href={`mailto:${client.email}`} className="text-base text-blue-600 hover:underline">
                        {client.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">No email provided</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-4 w-4" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {client.address ? (
                  <div className="space-y-2">
                    <p className="font-medium">{client.address.streetLine1}</p>
                    {client.address.streetLine2 && (
                      <p className="text-muted-foreground">{client.address.streetLine2}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span>{client.address.city}</span>
                      {client.address.state && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span>{client.address.state}</span>
                        </>
                      )}
                      {client.address.postalCode && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span>{client.address.postalCode}</span>
                        </>
                      )}
                    </div>
                    <div className="pt-1">
                      <Badge variant="outline">{client.address.country}</Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No address information available</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-4 w-4" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {client.billing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                        <p className="text-base font-mono">{client.billing.accountNumber}</p>
                      </div>
                      {client.billing.variableSymbol && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Variable Symbol</label>
                          <p className="text-base font-mono">{client.billing.variableSymbol}</p>
                        </div>
                      )}
                    </div>

                    {(client.billing.iban || client.billing.swiftCode) && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {client.billing.iban && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">IBAN</label>
                              <p className="text-base font-mono break-all">{client.billing.iban}</p>
                            </div>
                          )}
                          {client.billing.swiftCode && (
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">SWIFT Code</label>
                              <p className="text-base font-mono">{client.billing.swiftCode}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No billing information available</p>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Client ID: <span className="font-mono">{client.id}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}