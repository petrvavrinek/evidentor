"use client";

import { Upload } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypographyH3 } from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
	const { data } = authClient.useSession();
	if (!data?.user) return;

	const { user } = data;

	return (
		<>
			<div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-2">
				<Card className="shadow-none">
					<CardHeader>
						<TypographyH3>Personal profile</TypographyH3>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="image">Profile image</Label>
							<Avatar id="avatar" className="w-50 h-50 p-4 cursor-pointer">
								<AvatarImage src={user.image ?? ""} />
								<AvatarFallback>
									<Upload />
								</AvatarFallback>
							</Avatar>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input id="firstName" name="firstName" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input id="lastName" name="lastName" />
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									value={user.email}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Phone</Label>
								<Input id="phone" name="phone" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-none">
					<CardHeader>
						<TypographyH3>Business profile</TypographyH3>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="companyName">Company Name</Label>
							<Input id="companyName" name="companyName" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="address">Address</Label>
							<Input id="address" name="address" />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="city">City</Label>
								<Input id="city" name="city" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="state">State</Label>
								<Input id="state" name="state" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="zipCode">Zip Code</Label>
								<Input id="zipCode" name="zipCode" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="country">Country</Label>
							<Input id="country" name="country" />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="taxId">Tax ID / VAT Number</Label>
								<Input id="taxId" name="taxId" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="website">Website</Label>
								<Input id="website" name="website" />
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="businessEmail">Business Email</Label>
								<Input id="businessEmail" name="email" type="email" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="businessPhone">Business Phone</Label>
								<Input id="businessPhone" name="phone" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="w-full py-4 flex justify-between">
				<Button>Save</Button>
			</div>
		</>
	);
}
