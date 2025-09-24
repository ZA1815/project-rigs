import ThemeRegistry from "@/ThemeRegistry";

export const metadata = {
  title: 'Project Rigs',
  description: 'Rate my setup!'
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}