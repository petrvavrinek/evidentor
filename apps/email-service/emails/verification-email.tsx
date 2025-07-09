import { Link } from "@react-email/components";
import { Shield } from "lucide-react";
import Layout from "./layout";

interface VerificationEmailProps {
	user: {
		name: string;
		email: string;
	};
	verificationLink: string;
}

export default function VerificationEmail({
	verificationLink,
	user,
}: VerificationEmailProps) {
	return (
		<Layout>
			<div className="mb-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-3">
					Hi {user.name},
				</h2>
				<p className="text-gray-600 leading-relaxed mb-4">
					Thank you for signing up for Evidentor! To complete your account setup
					and ensure the security of your account, please verify your email
					address.
				</p>
				<p className="text-gray-600 leading-relaxed">
					Click the button below to verify your email address and activate your
					account:
				</p>
			</div>

			{/* Verification Button */}
			<div className="text-center mb-8">
				<Link
					href={verificationLink}
					className="inline-block bg-primary text-white no-underline font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
				>
					Verify Email Address
				</Link>
			</div>

			{/* Alternative Link */}
			<div className="bg-gray-50 p-6 rounded-lg mb-6">
				<p className="text-sm text-gray-600 mb-2">
					If the button above doesn't work, copy and paste this link into your
					browser:
				</p>
				<div className="bg-white p-3 rounded border break-all text-sm  font-mono">
					{verificationLink}
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
							This verification link will expire in 24 hours for security
							reasons. If you didn't create an account with Evidentor, please
							ignore this email.
						</p>
					</div>
				</div>
			</div>

			{/* What's Next */}
			<div className="border-t pt-6">
				<h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
				<ul className="space-y-2 text-gray-600">
					<li className="flex items-start space-x-2">
						<span className="text-primary font-bold">1.</span>
						<span>Click the verification button above</span>
					</li>
					<li className="flex items-start space-x-2">
						<span className="text-primary font-bold">2.</span>
						<span>Your email will be verified and your account activated</span>
					</li>
					<li className="flex items-start space-x-2">
						<span className="text-primary font-bold">3.</span>
						<span>
							You'll be redirected to your dashboard to start using Evidentor
						</span>
					</li>
				</ul>
			</div>
		</Layout>
	);
}

VerificationEmail.PreviewProps = {
	verificationLink: "http://localhost:3000/auth/verify/__TOKEN__",
	user: {
		email: "test@example.com",
		name: "Example",
	},
} satisfies VerificationEmailProps;
