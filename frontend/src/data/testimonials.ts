export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  review: string;
  carRented: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "John Smith",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    review: "Booking was incredibly easy and the car was in perfect condition. Picked up at Heathrow and returned in Manchester hassle-free!",
    carRented: "TESLA Model S",
  },
  {
    id: "t-2",
    name: "Sarah Jenkins",
    location: "Manchester, UK",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    review: "Super smooth experience. The AI recommendation found me the perfect economic SUV for our 5-person family trip through Scotland.",
    carRented: "PORSCHE Cayenne",
  },
  {
    id: "t-3",
    name: "David Ross",
    location: "Birmingham, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    review: "Unbeatable daily rates and zero hidden charges. Highly recommend Digital Pylot for business rentals around London.",
    carRented: "BMW X5",
  },
  {
    id: "t-4",
    name: "Emma Watson",
    location: "Edinburgh, UK",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    review: "The pickup process took less than 2 minutes. The Toyota Camry was spotless and fuel-efficient for our highlands roadtrip.",
    carRented: "TOYOTA Camry",
  },
];

