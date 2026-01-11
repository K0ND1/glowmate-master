import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Premise } from '../components/Premise';
import { Features } from '../components/Features';
import { Footer } from '../components/Footer';

export function Home() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-100 selection:text-brand-900">
            <Navbar />
            <Hero />
            <Premise />
            <Features />
            <Footer />
        </div>
    );
}
