import { render } from "@react-email/components";
import WelcomeEmail from "../emails/welcome-email";
import { sendMail } from "./transport";

const main = async () => {
	const res = await render(
		WelcomeEmail({ user: { email: "vavrinek", name: "petr" } }),
	);
	const r = await sendMail("vavrinekpetr155@gmail.com", "Test", res);

	console.log(r);
};

main();
