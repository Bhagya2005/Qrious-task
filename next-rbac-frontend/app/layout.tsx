import './globals.css'
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Toaster position="top-center" /> 
        {children}
      </body>
    </html>
  );
}