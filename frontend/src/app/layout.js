import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

export const metadata = {
  title: 'Project Rigs',
  description: 'Rate my setup!'
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}