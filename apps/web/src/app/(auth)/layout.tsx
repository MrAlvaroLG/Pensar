export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen max-h-max w-full items-center justify-center bg-muted">
      {children}
    </div>
  );
}