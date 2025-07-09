import { Link } from "@react-email/components";
import { Shield } from "lucide-react";
import Layout from "./layout";

interface VerificationEmailProps {
	user: {
		name: string;
		email: string;
	};
	passwordResetLink: string;
}

export default function PasswordResetEmail({
	passwordResetLink,
	user,
}: VerificationEmailProps) {
	return (
		<Layout>
			<div className="mb-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-3">
					Hi {user.name},
				</h2>
				<p className="text-gray-600 leading-relaxed mb-4">
					We received a request to reset the password for your Evidentor{" "}
					account. If you made this request, click the button below to create a
					new password:
				</p>
			</div>

			{/* Reset Button */}
			<div className="text-center mb-8">
				<Link
					href={passwordResetLink}
					className="inline-block bg-red-600 hover:bg-red-700 no-underline text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
				>
					Reset My Password
				</Link>
			</div>

			{/* Alternative Link */}
			<div className="bg-gray-50 p-6 rounded-lg mb-6">
				<p className="text-sm text-gray-600 mb-2">
					If the button above doesn't work, copy and paste this link into your
					browser:
				</p>
				<div className="bg-white p-3 rounded border break-all text-sm text-blue-600 font-mono">
					{passwordResetLink}
				</div>
			</div>

			{/* Security Notice */}
			<div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
				<div className="flex items-start space-x-3">
					<Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
					<div>
						<h3 className="font-semibold text-amber-800 mb-1">
							Security Notice
						</h3>
						<p className="text-sm text-amber-700">
							This password reset link will expire in 1 hour for security
							reasons. If you didn't request a password reset, please ignore
							this email - your account remains secure.
						</p>
					</div>
				</div>
			</div>

			{/* Additional Security Tips */}
			<div className="border-t pt-6">
				<h3 className="font-semibold text-gray-900 mb-3">
					Password Security Tips:
				</h3>
				<ul className="space-y-2 text-gray-600 text-sm">
					<li className="flex items-start space-x-2">
						<span className="text-red-600">•</span>
						<span>
							Use at least 8 characters with a mix of letters, numbers, and
							symbols
						</span>
					</li>
					<li className="flex items-start space-x-2">
						<span className="text-red-600">•</span>
						<span>Avoid using personal information or common words</span>
					</li>
					<li className="flex items-start space-x-2">
						<span className="text-red-600">•</span>
						<span>Don't reuse passwords from other accounts</span>
					</li>
					<li className="flex items-start space-x-2">
						<span className="text-red-600">•</span>
						<span>Consider using a password manager</span>
					</li>
				</ul>
			</div>
		</Layout>
	);
}

PasswordResetEmail.PreviewProps = {
	passwordResetLink: "http://localhost:3000/auth/verify?token=__TOKEN__",
	user: {
		email: "test@example.com",
		name: "Example",
	},
} satisfies VerificationEmailProps;
