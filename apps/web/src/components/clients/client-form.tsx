"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import LoadableButton from "@evidentor/ui/components/ui/loadable-button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@evidentor/ui/components/ui/collapsible";
import AddressForm from "../address/address-form";
import { zPostClientsData } from "@/lib/api/zod.gen";


const CreateClientSchema = zPostClientsData.shape.body;
type CreateClient = z.infer<typeof CreateClientSchema>;

interface ClientFormProps {
	onCancel?: () => void;
	onSubmit?: (client: CreateClient) => void;
	client?: CreateClient;
	loading?: boolean;
}

export function ClientForm({
	onCancel,
	onSubmit,
	client,
	loading,
}: ClientFormProps) {
	const form = useForm<CreateClient>({
		resolver: zodResolver(CreateClientSchema),
		defaultValues: client,
		criteriaMode: "firstError",
		shouldFocusError: true,
	});

	const onSubmitComponent = async (e: CreateClient) => {
		onSubmit?.(e);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmitComponent)}
				className="space-y-2"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 space-x-2">

					<FormField
						control={form.control}
						name="companyName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="contactName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contact Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					rules={{ required: false }}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="email"
									value={field.value ?? ""}
									required={false}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="w-full">
					<Collapsible>
						<CollapsibleTrigger asChild>
							<Button variant="ghost" size="icon" className="w-full">
								Address
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent className="my-2">
							<AddressForm control={form.control} name="address" />
						</CollapsibleContent>
					</Collapsible>
				</div>
				<div className="flex justify-end gap-2 pt-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<LoadableButton loading={loading} type="submit">
						Save Client
					</LoadableButton>
				</div>
			</form>
		</Form>
	);
}
