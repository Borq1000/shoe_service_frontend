import { SessionProvider } from "next-auth/react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="container mx-auto py-12 px-4">{children}</div>
    </SessionProvider>
  );
}
