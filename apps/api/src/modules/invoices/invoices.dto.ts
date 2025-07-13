import { type Static, Type } from "@sinclair/typebox";

export const InvoiceStatus = ["draft", "sent", "paid", "overdue"] as const;
export type InvoiceStatus = (typeof InvoiceStatus)[number];

export const InvoiceDTO = Type.Object({
	clientId: Type.Number(),
	projectId: Type.Optional(Type.Number()),
	amount: Type.Number(),
	status: Type.Union([
		Type.Literal("draft"),
		Type.Literal("paid"),
		Type.Literal("overdue"),
	]),
	dueDate: Type.Optional(Type.String({ format: "date-time" })),
});

export type InvoiceDTOType = Static<typeof InvoiceDTO>;

export const InvoiceUpdateDTO = Type.Partial(InvoiceDTO);
export type InvoiceUpdateDTOType = Static<typeof InvoiceUpdateDTO>;
