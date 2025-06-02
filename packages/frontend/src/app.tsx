import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import "./styles/app.css";

export default function App() {
  return (
    <SidebarProvider>
      <div class="flex h-[100vh]">
        <Router
          root={(props) => (
            <>
              <AppSidebar />
              <Suspense>{props.children}</Suspense>
            </>
          )}
        >
          <FileRoutes />
        </Router>
      </div>
    </SidebarProvider>
  );
}
