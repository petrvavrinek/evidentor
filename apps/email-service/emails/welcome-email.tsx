import Layout from "../src/layout";

interface WelcomeEmailProps {
	user: {
		name: string;
		email: string;
	};
}

import "../globals.css";

export default function Email({ user }: WelcomeEmailProps) {
	return (
		<Layout>
			<h2 className="text-gray-800 text-xl mb-5">Hi {user.name},</h2>

			<p className="text-gray-600 leading-relaxed mb-5">
				Welcome to Evidentor! We're excited to have you on board. Your
				account has been successfully created and you're ready to start managing
				your projects and time tracking.
			</p>

			<p className="text-gray-600 leading-relaxed mb-8">
				Here's what you can do with your new account:
			</p>

			<ul className="text-gray-600 leading-relaxed mb-8 pl-5 space-y-2">
				<li>Track time across multiple projects</li>
				<li>Manage clients and project details</li>
				<li>Generate professional invoices</li>
				<li>View detailed reports and analytics</li>
				<li>Schedule events and deadlines</li>
			</ul>

			<div className="text-center mb-8">
				<a
					href={"https://evidentor.cz"}
					className="inline-block bg-primary  text-white font-bold py-3 px-6 rounded-md no-underline transition-colors"
				>
					Get Started
				</a>
			</div>
		</Layout>
	);
}

Email.PreviewProps = {
	user: {
		email: "test@test.cz",
		name: "Test user",
	},
} satisfies WelcomeEmailProps;
