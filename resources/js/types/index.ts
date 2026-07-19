export type * from './auth';
export type * from './navigation';
export type * from './ui';
export interface Package {
    id: string;
    title: string;
    price: number;
    airline: string;
    hotelMecca: string;
    hotelMedina: string;
    departureDate: string;
    features: string[];
    image: string;
    availableSeats?: number;
    totalSeats?: number;
    is_best_seller?: boolean;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth?: {
        user: any;
    };
    packages: Package[];
};
