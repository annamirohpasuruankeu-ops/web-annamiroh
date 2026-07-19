import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import Packages from '@/components/packages';
import Gallery from '@/components/gallery';
import AgencyPromo from '@/components/agency-promo';
import Footer from '@/components/footer';
import ChatWidget from '@/components/chat-widget';
import PromoPopup from '@/components/promo-popup';

export default function Home({
    packages,
    popupPromo,
    galleries,
}: PageProps & { popupPromo?: any; galleries?: any[] }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-amber-400/30 selection:text-emerald-900">
            <Head title="PT. Annamiroh Travelindo | Beranda" />

            <Navbar />

            <main>
                <Hero />

                <Packages packages={packages} />

                <Gallery items={galleries} />
                <AgencyPromo />
            </main>

            <Footer />
            <ChatWidget />
            <PromoPopup popupPromo={popupPromo || null} />
        </div>
    );
}
