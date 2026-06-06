import "./globals.css";
import { Roboto, Great_Vibes } from "next/font/google"; // Uvozimo Great_Vibes umesto Alex_Brush

const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

// Postavljamo Great_Vibes koji je pravi, spojeni script font
const scriptFont = Great_Vibes({
  subsets: ["latin", "latin-ext"], // latin-ext dodaje podršku za naša slova č, ć, š, ž
  weight: ["400"],
  variable: "--font-cursive",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr" className={`${roboto.variable} ${scriptFont.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}