import NavBar from "@/components/layout/navbar";

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div>
      <NavBar></NavBar>
      {children}
    </div>
  );
}
