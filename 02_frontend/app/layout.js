export const metadata = {
  title: 'My App',
  description: 'Kyithar 6090059 project',
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
