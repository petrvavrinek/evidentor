import { Button } from "@/components/ui/button";
import {
  Layers,
  ArrowRight,
  Clock,
  Users,
  FileText,
  CreditCard,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <body>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />

              <span className="text-xl font-bold">Evidentor</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Features
              </Link>
              <Link
                href="#benefits"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Benefits
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Link href="/auth">Log in</Link>
              </Button>
              <Button size="sm">Get Started</Button>
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
                      Organize Your Work, Maximize Your Time
                    </h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      Evidentor is your completely free, all-in-one solution for
                      time tracking, project management, and client invoicing.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button size="lg" className="px-8">
                      <Link href="/auth" className="flex items-center">
                        Start for free
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
                          <h3 className="text-lg font-medium">Time Tracking</h3>
                          <p className="text-sm text-muted-foreground">
                            Track hours with precision
                          </p>
                        </div>
                        <div className="rounded-lg bg-background p-4 shadow-sm">
                          <Users className="h-8 w-8 text-primary mb-2" />
                          <h3 className="text-lg font-medium">
                            Client Management
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Organize client information
                          </p>
                        </div>
                        <div className="rounded-lg bg-background p-4 shadow-sm">
                          <FileText className="h-8 w-8 text-primary mb-2" />
                          <h3 className="text-lg font-medium">
                            Project Tracking
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Monitor project progress
                          </p>
                        </div>
                        <div className="rounded-lg bg-background p-4 shadow-sm">
                          <CreditCard className="h-8 w-8 text-primary mb-2" />
                          <h3 className="text-lg font-medium">Invoicing</h3>
                          <p className="text-sm text-muted-foreground">
                            Generate & send invoices
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
                    Features
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Powerful Features, Completely Free
                  </h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Evidentor combines powerful tools to streamline your
                    workflow and boost productivity - all at no cost.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3 md:gap-12">
                <div className="grid gap-1">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Time Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Track time spent on tasks and projects with precision. Set
                    timers, add manual entries, and categorize your work.
                  </p>
                </div>
                <div className="grid gap-1">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Client Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Store client information, track communication history, and
                    manage relationships all in one place.
                  </p>
                </div>
                <div className="grid gap-1">
                  <Layers className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Project Organization</h3>
                  <p className="text-sm text-muted-foreground">
                    Create projects, assign tasks, set deadlines, and monitor
                    progress with intuitive tools.
                  </p>
                </div>
                <div className="grid gap-1">
                  <CreditCard className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Smart Invoicing</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate professional invoices based on tracked time and
                    project milestones. Send directly to clients.
                  </p>
                </div>
                <div className="grid gap-1">
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Insightful Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    Gain valuable insights with detailed reports on
                    productivity, billable hours, and project profitability.
                  </p>
                </div>
                <div className="grid gap-1">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Share projects and collaborate with team members. Perfect
                    for agencies and teams. (Coming Soon)
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
                    Benefits
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Why Choose Evidentor?
                  </h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Discover how Evidentor transforms your work management and
                    boosts productivity.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Save Time</h3>
                  <p className="mt-2 text-muted-foreground">
                    Automate repetitive tasks and streamline your workflow to
                    focus on what matters most.
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Get Paid Faster</h3>
                  <p className="mt-2 text-muted-foreground">
                    Create professional invoices in seconds and send them
                    directly to clients with payment options.
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">
                    Increase Productivity
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Track your time and identify areas for improvement to
                    maximize your efficiency.
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">
                    Improve Client Relations
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Maintain transparent communication and deliver projects on
                    time with organized client management.
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">
                    Centralize Your Work
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Keep all your projects, clients, and tasks in one place for
                    seamless organization.
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Detailed Reporting</h3>
                  <p className="mt-2 text-muted-foreground">
                    Generate comprehensive reports to analyze your work patterns
                    and make informed decisions.
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
                    Ready to Transform Your Workflow?
                  </h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Join professionals who use Evidentor to manage their work -
                    completely free, forever.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="px-8">
                    <Link href="/auth">Get Started - It's Free!</Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t bg-muted">
          <div className="container mx-auto flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
            <div className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Evidentor</span>
            </div>
            <nav className="flex flex-wrap gap-4 md:gap-6">
              <Link
                href="#"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Contact
              </Link>
            </nav>
            <div className="text-sm text-muted-foreground">
              © 2025 Evidentor. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </body>
  );
}
