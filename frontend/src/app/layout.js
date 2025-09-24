import ThemeRegistry from "@/ThemeRegistry";
import Navbar from "@/components/Navbar";
import ApolloProvider from "@/components/ApolloProvider";

export const metadata = {
  title: 'Project Rigs',
  description: 'Rate my setup!'
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider>
          <ThemeRegistry>
            <Navbar />
            <main>
              {children}
            </main>
          </ThemeRegistry>
        </ApolloProvider>
      </body>
    </html>
  );
}