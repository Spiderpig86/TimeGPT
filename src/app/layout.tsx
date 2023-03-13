import '../styles/cirrus-ui.css';
import '../styles/app.scss';

export const metadata = {
    title: 'DateGPT',
    description: 'AI-powered time and date generator.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
