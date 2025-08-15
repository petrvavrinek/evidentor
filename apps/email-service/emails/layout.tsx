import { Body, Head, Html, Img, Link } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

import config from "../tailwind.config.mjs";

interface LayoutProps {
	children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<Tailwind config={config}>
			<Html>
				<Head />
				<Body>
					<div className="font-sans max-w-2xl mt-8 mx-auto bg-white">
						<Link href="https://evidentor.cz" className="text-primary">
							<div className="w-fit flex items-center mx-auto gap-2">
								<Img src="https://evidentor.cz/logo-black.svg" width={32} height={32}/>
								<h2>Evidentor</h2>
							</div>
						</Link>

						<div className="p-8">{children ?? "Content here"}</div>

						<div className="bg-gray-50 p-5 text-center border-t border-gray-200">
							<p className="text-gray-500 text-sm m-0">
								Evidentor | info@evidentor.cz
							</p>
						</div>
						<p className="text-gray-500 text-sm m-0 mt-5">
							* Email design is temporary
						</p>
					</div>
				</Body>
			</Html>
		</Tailwind>
	);
}
