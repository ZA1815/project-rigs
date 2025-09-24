import ThemeRegistry from "@/ThemeRegistry";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: 'Project Rigs',
  description: 'Rate my setup!'
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Navbar />
          <main>
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}