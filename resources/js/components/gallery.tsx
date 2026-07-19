import { motion } from 'framer-motion';

const fallbackImages = [
    { id: 1, src: 'https://picsum.photos/seed/makkah1/800/800', alt: 'Makkah' },
    {
        id: 2,
        src: 'https://picsum.photos/seed/madinah2/800/800',
        alt: 'Madinah',
    },
    { id: 3, src: 'https://picsum.photos/seed/jamaah3/800/800', alt: 'Jamaah' },
    { id: 4, src: 'https://picsum.photos/seed/hotel4/800/800', alt: 'Hotel' },
    { id: 5, src: 'https://picsum.photos/seed/bus5/800/800', alt: 'Bus Tour' },
    { id: 6, src: 'https://picsum.photos/seed/food6/800/800', alt: 'Catering' },
];

interface GalleryProps {
    items?: Array<{
        id: number;
        title: string | null;
        image: string;
    }>;
}

export default function Gallery({ items }: GalleryProps) {
    const displayImages =
        items && items.length > 0
            ? items.map((item) => ({
                  id: item.id,
                  src: item.image,
                  alt: item.title || 'Galeri Perjalanan',
              }))
            : fallbackImages;

    return (
        <section id="gallery" className="py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-10">
                    <h2 className="border-l-4 border-amber-400 pl-4 text-2xl font-bold tracking-tight text-emerald-900 md:text-3xl">
                        Galeri Perjalanan
                    </h2>
                    <p className="mt-3 ml-5 max-w-2xl text-sm text-slate-500">
                        Momen-momen indah ibadah di Tanah Suci bersama Annamirah
                        Travel.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {displayImages.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                            className="aspect-[4/3] overflow-hidden rounded-lg bg-slate-200 shadow-sm"
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                title={img.alt}
                                referrerPolicy="no-referrer"
                                className="h-full w-full cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
