"use client";

import { User } from "lucide-react";

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@evidentor/ui/components/ui/tabs";

import PageHeader from "@/components/page-header";
import UserConnections from "@/components/settings/user/connections";
import Profile from "@/components/settings/user/profile";
import UserSessions from "@/components/settings/user/sessions";

export default function SettingsUserPage() {
	return (
		<>
			<PageHeader
				title="User settings"
				subtitle="Manage your personal and business information"
			/>

			<Tabs searchParam="tab" className="w-full" defaultValue="profile">
				<TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
					<TabsTrigger value="profile" className="flex items-center gap-2">
						<User className="h-4 w-4" />
						<span className="hidden md:inline">Profile</span>
					</TabsTrigger>
					<TabsTrigger value="connections" className="flex items-center gap-2">
						<User className="h-4 w-4" />
						<span className="hidden md:inline">Connections</span>
					</TabsTrigger>
					<TabsTrigger value="sessions" className="flex items-center gap-2">
						<User className="h-4 w-4" />
						<span className="hidden md:inline">Sessions</span>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="profile">
					<Profile />
				</TabsContent>
				<TabsContent value="connections">
					<UserConnections />
				</TabsContent>
				<TabsContent value="sessions">
					<UserSessions />
				</TabsContent>
			</Tabs>
		</>
	);
}
