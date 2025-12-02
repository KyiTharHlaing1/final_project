export const metadata = {
  title: 'My App',
  description: 'Kyi Thar Hlaing 6704995',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
