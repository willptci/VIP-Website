import ProfileNav from '@/components/ui/ProfileNav'
export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <main>
          <ProfileNav/>
          {children}
      </main>
    );
  }