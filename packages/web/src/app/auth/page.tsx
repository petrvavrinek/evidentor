"use client";

import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsContent value="signin">
        <LoginForm>
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
        </LoginForm>
      </TabsContent>

      <TabsContent value="signup">
        <RegisterForm>
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
        </RegisterForm>
      </TabsContent>
    </Tabs>
  );

  return;
}
