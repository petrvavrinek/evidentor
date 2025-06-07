"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { SignInAuthData, SignInForm } from "@/components/auth/sign-in-form";
import { SignUpAuthData, SignUpForm } from "@/components/auth/sign-up-form";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const session = authClient.useSession();

  useEffect(() => {
    if (session.data) return redirect("/app");
  }, [session]);

  const onLoginSubmit = async (data: SignInAuthData) => {
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
  };

  const onRegisterSubmit = async (data: SignUpAuthData) => {
    const result = await authClient.signUp.email({
      name: data.fullName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsContent value="signin">
        <SignInForm onSubmit={onLoginSubmit}>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="underline underline-offset-4"
              onClick={() => setActiveTab("signup")}
            >
              Sign up
            </a>
          </div>
        </SignInForm>
      </TabsContent>

      <TabsContent value="signup">
        <SignUpForm onSubmit={onRegisterSubmit}>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <a
              href="#"
              className="underline underline-offset-4"
              onClick={() => setActiveTab("signin")}
            >
              Sign up
            </a>
          </div>
        </SignUpForm>
      </TabsContent>
    </Tabs>
  );

  return;
}
