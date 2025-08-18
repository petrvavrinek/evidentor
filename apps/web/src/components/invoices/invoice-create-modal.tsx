import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@evidentor/ui/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import { Label } from "@evidentor/ui/components/ui/label";

import { ProjectSelect } from "@/components/project-select";
import { Language } from "@/i18n/routing";
import { postInvoices } from "@/lib/api/sdk.gen";
import { zPostInvoicesData } from "@/lib/api/zod.gen";

import LocaleInput from "../locale-input";

interface InvoiceCreateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreated: () => void;
}

const FormSchema = zPostInvoicesData.shape.body;
type FormData = z.infer<typeof FormSchema>;

export default function InvoiceCreateModal({
	isOpen,
	onClose,
	onCreated,
}: InvoiceCreateModalProps) {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const locale = useLocale();
	const form = useForm<FormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			dueDate: "",
			currency: "czk",
			items: [{ name: "", qty: 1, unitPrice: 0 }],
			language: locale as Language
		},
		shouldFocusError: true,
		criteriaMode: "all"
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "items",
	});

	const handleSubmit = async (values: FormData) => {
		setLoading(true);
		setError(null);
		try {
			await postInvoices({
				body: {
					projectId: values.projectId,
					currency: values.currency,
					dueDate: values.dueDate ? new Date(values.dueDate as never) : null,
					items: values.items,
					language: values.language
				}
			});
			onCreated();
			onClose();
			form.reset();
		} catch (err: any) {
			setError(err?.message || "Failed to create invoice");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-xl">
				<DialogTitle>New Invoice</DialogTitle>
				<Form {...form}>
					<form
						className="space-y-4"
						onSubmit={form.handleSubmit(handleSubmit)}
					>
						<FormField
							control={form.control}
							name="projectId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Project</FormLabel>
									<FormControl>
										<ProjectSelect
											projectId={field.value}
											onSelect={(project) =>
												field.onChange(project?.id ?? null)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-2">
							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Due Date</FormLabel>
										<FormControl>
											<Input type="date" {...field} required />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="currency"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Currency</FormLabel>
										<FormControl>
											<select
												className="border rounded px-2 w-full h-[36px]"
												{...field}
											>
												<option value="czk">CZK</option>
												<option value="eur">EUR</option>
												<option value="usd">USD</option>
											</select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div>
							<FormField
								control={form.control}
								name="language"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Language</FormLabel>
										<FormControl>
											<LocaleInput {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div>
							<Label className="font-semibold mb-2">Items</Label>
							{fields.map((item, idx) => (
								<FormItem>
									<div key={item.id} className="flex gap-2 mb-2 items-center">
										<Controller
											name={`items.${idx}.name`}
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input placeholder="Name" {...field} required />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Controller
											name={`items.${idx}.qty`}
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															placeholder="Qty"
															type="number"
															min={1}
															{...field}
															required
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Controller
											name={`items.${idx}.unitPrice`}
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															placeholder="Unit Price"
															type="number"
															min={0}
															{...field}
															required
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											type="button"
											variant="outline"
											onClick={() => remove(idx)}
											disabled={fields.length === 1}
										>
											<Trash />
										</Button>
										<FormMessage />
									</div>
								</FormItem>
							))}
							<Button
								type="button"
								variant="secondary"
								onClick={() => append({ name: "", qty: 1, unitPrice: 0 })}
							>
								Add Item
							</Button>
						</div>
						{error && <div className="text-destructive text-sm">{error}</div>}
						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={loading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? "Creating..." : "Create Invoice"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
