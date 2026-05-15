import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import LayoutShell from "@/components/layout/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevHub — The Developer Social Platform",
  description:
    "Showcase your projects, share your knowledge, and connect with developers worldwide. DevHub is the social platform built for developers.",
  keywords: ["developer", "portfolio", "projects", "social", "platform", "devhub"],
  openGraph: {
    title: "DevHub — The Developer Social Platform",
    description: "Showcase your projects, share your knowledge, and connect with developers worldwide.",
    type: "website",
  },
};

// Inline script to prevent theme flash — runs before React hydrates
const themeScript = `(function(){try{var t=localStorage.getItem("devhub-theme");if(t){document.documentElement.setAttribute("data-theme",t)}else{var prefersDark=window.matchMedia("(prefers-color-scheme:dark)").matches;document.documentElement.setAttribute("data-theme",prefersDark?"dark":"light")}}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <LayoutShell>{children}</LayoutShell>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
