import {
	ArrowRight,
	BarChart3,
	Clock,
	CreditCard,
	FileText,
	Layers,
	Users,
} from "lucide-react";
import Link from "next/link";

import LanguageSwitch from "@/components/language-switch";
import { Button } from "@evidentor/ui/components/ui/button";
import AppLogo from "@/components/app-logo";
import { useTranslations } from "next-intl";

export default function LandingPage() {
	const t = useTranslations("landing");

	return (
		<body>
			<div className="flex min-h-screen flex-col">
				<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="container mx-auto flex h-16 items-center justify-between">
						<div className="flex items-center gap-2">
							<AppLogo className="w-8 h-8" />
							<span className="text-xl font-bold">{t("header.brandName")}</span>
						</div>
						<nav className="hidden md:flex items-center gap-6">
							<Link
								href="#features"
								className="text-sm font-medium hover:underline underline-offset-4"
							>
								{t("header.nav.features")}
							</Link>
							<Link
								href="#benefits"
								className="text-sm font-medium hover:underline underline-offset-4"
							>
								{t("header.nav.benefits")}
							</Link>
						</nav>
						<div className="flex items-center gap-4">
							<Button variant="outline" size="sm" className="hidden md:flex">
								<Link href="/auth">{t("header.buttons.login")}</Link>
							</Button>
							<Button size="sm">{t("header.buttons.getStarted")}</Button>
						</div>
					</div>
				</header>
				<main className="flex-1">
					<section className="py-24 md:py-32 lg:py-40">
						<div className="container mx-auto px-4 md:px-6">
							<div className="grid gap-12 md:grid-cols-2 md:gap-16">
								<div className="flex flex-col justify-center space-y-4">
									<div className="space-y-2">
										<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
											{t("hero.title")}
										</h1>
										<p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
											{t("hero.subtitle")}
										</p>
									</div>
									<div className="flex flex-col gap-2 min-[400px]:flex-row">
										<Button size="lg" className="px-8">
											<Link href="/auth" className="flex items-center">
												{t("hero.cta")}
												<ArrowRight className="ml-2 h-4 w-4" />
											</Link>
										</Button>
									</div>
								</div>
								<div className="flex items-center justify-center">
									<div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-4 shadow-lg">
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="grid grid-cols-2 gap-4 p-4">
												<div className="rounded-lg bg-background p-4 shadow-sm">
													<Clock className="h-8 w-8 text-primary mb-2" />
													<h3 className="text-lg font-medium">
														{t("hero.cards.timeTracking.title")}
													</h3>
													<p className="text-sm text-muted-foreground">
														{t("hero.cards.timeTracking.description")}
													</p>
												</div>
												<div className="rounded-lg bg-background p-4 shadow-sm">
													<Users className="h-8 w-8 text-primary mb-2" />
													<h3 className="text-lg font-medium">
														{t("hero.cards.clientManagement.title")}
													</h3>
													<p className="text-sm text-muted-foreground">
														{t("hero.cards.clientManagement.description")}
													</p>
												</div>
												<div className="rounded-lg bg-background p-4 shadow-sm">
													<FileText className="h-8 w-8 text-primary mb-2" />
													<h3 className="text-lg font-medium">
														{t("hero.cards.projectTracking.title")}
													</h3>
													<p className="text-sm text-muted-foreground">
														{t("hero.cards.projectTracking.description")}
													</p>
												</div>
												<div className="rounded-lg bg-background p-4 shadow-sm">
													<CreditCard className="h-8 w-8 text-primary mb-2" />
													<h3 className="text-lg font-medium">
														{t("hero.cards.invoicing.title")}
													</h3>
													<p className="text-sm text-muted-foreground">
														{t("hero.cards.invoicing.description")}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section id="features" className="bg-muted py-16 md:py-24">
						<div className="container mx-auto px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
										{t("features.badge")}
									</div>
									<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
										{t("features.title")}
									</h2>
									<p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
										{t("features.subtitle")}
									</p>
								</div>
							</div>
							<div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3 md:gap-12">
								<div className="grid gap-1">
									<Clock className="h-8 w-8 text-primary mb-2" />
									<h3 className="text-xl font-bold">
										{t("features.items.timeTracking.title")}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t("features.items.timeTracking.description")}
									</p>
								</div>
								<div className="grid gap-1">
									<Users className="h-8 w-8 text-primary mb-2" />
									<h3 className="text-xl font-bold">
										{t("features.items.clientManagement.title")}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t("features.items.clientManagement.description")}
									</p>
								</div>
								<div className="grid gap-1">
									<Layers className="h-8 w-8 text-primary mb-2" />
									<h3 className="text-xl font-bold">
										{t("features.items.projectOrganization.title")}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t("features.items.projectOrganization.description")}
									</p>
								</div>
								<div className="grid gap-1">
									<CreditCard className="h-8 w-8 text-primary mb-2" />
									<h3 className="text-xl font-bold">
										{t("features.items.smartInvoicing.title")}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t("features.items.smartInvoicing.description")}
									</p>
								</div>
								<div className="grid gap-1">
									<BarChart3 className="h-8 w-8 text-primary mb-2" />
									<h3 className="text-xl font-bold">
										{t("features.items.insightfulReports.title")}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t("features.items.insightfulReports.description")}
									</p>
								</div>
								<div className="grid gap-1">
									<Users className="h-8 w-8 text-primary mb-2" />
									<h3 className="text-xl font-bold">
										{t("features.items.teamCollaboration.title")}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t("features.items.teamCollaboration.description")}
									</p>
								</div>
							</div>
						</div>
					</section>
					<section id="benefits" className="py-16 md:py-24">
						<div className="container mx-auto px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
										{t("benefits.badge")}
									</div>
									<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
										{t("benefits.title")}
									</h2>
									<p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
										{t("benefits.subtitle")}
									</p>
								</div>
							</div>
							<div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
								<div className="rounded-xl border bg-card p-6 shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Clock className="h-6 w-6" />
									</div>
									<h3 className="mt-4 text-xl font-bold">
										{t("benefits.items.saveTime.title")}
									</h3>
									<p className="mt-2 text-muted-foreground">
										{t("benefits.items.saveTime.description")}
									</p>
								</div>
								<div className="rounded-xl border bg-card p-6 shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<CreditCard className="h-6 w-6" />
									</div>
									<h3 className="mt-4 text-xl font-bold">
										{t("benefits.items.getPaidFaster.title")}
									</h3>
									<p className="mt-2 text-muted-foreground">
										{t("benefits.items.getPaidFaster.description")}
									</p>
								</div>
								<div className="rounded-xl border bg-card p-6 shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<BarChart3 className="h-6 w-6" />
									</div>
									<h3 className="mt-4 text-xl font-bold">
										{t("benefits.items.increaseProductivity.title")}
									</h3>
									<p className="mt-2 text-muted-foreground">
										{t("benefits.items.increaseProductivity.description")}
									</p>
								</div>
								<div className="rounded-xl border bg-card p-6 shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Users className="h-6 w-6" />
									</div>
									<h3 className="mt-4 text-xl font-bold">
										{t("benefits.items.improveClientRelations.title")}
									</h3>
									<p className="mt-2 text-muted-foreground">
										{t("benefits.items.improveClientRelations.description")}
									</p>
								</div>
								<div className="rounded-xl border bg-card p-6 shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Layers className="h-6 w-6" />
									</div>
									<h3 className="mt-4 text-xl font-bold">
										{t("benefits.items.centralizeWork.title")}
									</h3>
									<p className="mt-2 text-muted-foreground">
										{t("benefits.items.centralizeWork.description")}
									</p>
								</div>
								<div className="rounded-xl border bg-card p-6 shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<FileText className="h-6 w-6" />
									</div>
									<h3 className="mt-4 text-xl font-bold">
										{t("benefits.items.detailedReporting.title")}
									</h3>
									<p className="mt-2 text-muted-foreground">
										{t("benefits.items.detailedReporting.description")}
									</p>
								</div>
							</div>
						</div>
					</section>
					<section className="py-16 md:py-24">
						<div className="container mx-auto px-4 md:px-6">
							<div className="flex flex-col items-center justify-center space-y-4 text-center">
								<div className="space-y-2">
									<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
										{t("cta.title")}
									</h2>
									<p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
										{t("cta.subtitle")}
									</p>
								</div>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									<Button size="lg" className="px-8">
										<Link href="/auth">{t("cta.buttons.getStarted")}</Link>
									</Button>
									<Button size="lg" variant="outline">
										{t("cta.buttons.learnMore")}
									</Button>
								</div>
							</div>
						</div>
					</section>
				</main>
				<footer className="border-t bg-muted">
					<div className="container mx-auto flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
						<div className="flex items-center gap-2">
							<AppLogo className="w-8 h-8"/>
							<span className="text-xl font-bold">{t("footer.brandName")}</span>
						</div>
						<nav className="flex flex-wrap gap-4 md:gap-6">
							<Link
								href="#"
								className="text-sm font-medium hover:underline underline-offset-4"
							>
								{t("footer.nav.terms")}
							</Link>
							<Link
								href="#"
								className="text-sm font-medium hover:underline underline-offset-4"
							>
								{t("footer.nav.privacy")}
							</Link>
							<Link
								href="#"
								className="text-sm font-medium hover:underline underline-offset-4"
							>
								{t("footer.nav.contact")}
							</Link>
						</nav>
						<div className="text-sm text-muted-foreground flex flex-col">
							<p>{t("footer.copyright")}</p>
							<LanguageSwitch className="mt-2" />
						</div>
					</div>
				</footer>
			</div>
		</body>
	);
}
