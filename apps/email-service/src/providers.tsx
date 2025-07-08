import { Tailwind } from "@react-email/tailwind";
import config from "../tailwind.config.mjs";

interface ProvidersProps {
	children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
	
	return <Tailwind config={config}>{children}</Tailwind>;
}

export default Providers;
