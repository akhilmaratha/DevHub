import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Developers", href: "/explore/developers" },
    { label: "Projects", href: "/explore/projects" },
    { label: "Blog", href: "/blogs" },
  ],
  Account: [
    { label: "Sign Up", href: "/signup" },
    { label: "Log In", href: "/login" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <p className="text-[15px] font-semibold text-zinc-200 tracking-tight mb-2">DevHub</p>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              The platform for developers to showcase work, share knowledge, and connect.
            </p>
          </div>

          <div className="flex gap-12">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">{title}</h3>
                <ul className="space-y-1.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-5">
          <p className="text-[11px] text-zinc-600">
            &copy; {new Date().getFullYear()} DevHub
          </p>
        </div>
      </div>
    </footer>
  );
}
