export interface FeaturedProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  category: string;
  isFeatured?: boolean;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  placeholderLabel: string;
}

export async function getFeaturedProperties(): Promise<FeaturedProperty[]> {
  // Simulating async fetch
  return [
    {
      id: "prop-1",
      title: "Modern 3 BHK Family Apartment in Dhanmondi",
      price: 35000,
      location: "Dhanmondi 27, Dhaka",
      category: "Family Apartment",
      isFeatured: true,
      bedrooms: 3,
      bathrooms: 3,
      sizeSqFt: 1450,
      placeholderLabel: "Property card photo — Dhanmondi 3BHK listing",
    },
    {
      id: "prop-2",
      title: "Single Seat Room in Executive Bachelor Mess",
      price: 6500,
      location: "Mirpur DOHS, Dhaka",
      category: "Bachelor Mess",
      isFeatured: false,
      bedrooms: 1,
      bathrooms: 1,
      sizeSqFt: 180,
      placeholderLabel: "Property card photo — Mirpur DOHS seat rent",
    },
    {
      id: "prop-3",
      title: "Spacious Sublet Room with Attached Balcony",
      price: 12000,
      location: "Gulshan 1, Dhaka",
      category: "Sublet",
      isFeatured: true,
      bedrooms: 1,
      bathrooms: 1,
      sizeSqFt: 240,
      placeholderLabel: "Property card photo — Gulshan 1 sublet room",
    },
    {
      id: "prop-4",
      title: "Luxury Duplex Penthouse with Rooftop Garden",
      price: 75000,
      location: "Uttara Sector 4, Dhaka",
      category: "Family Apartment",
      isFeatured: false,
      bedrooms: 4,
      bathrooms: 4,
      sizeSqFt: 2800,
      placeholderLabel: "Property card photo — Uttara Duplex Penthouse",
    },
  ];
}
