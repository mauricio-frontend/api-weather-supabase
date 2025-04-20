import "./globals.css";

export const metadata = {
  title: "ChatBot Clima",
  description: "Interaja com o ChatBot e veja dados climáticos visualmente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        <main className="max-w-4xl mx-auto p-4 min-h-screen flex flex-col">
          <header className="py-4 text-center text-2xl font-semibold">
            ChatBot de Clima
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
