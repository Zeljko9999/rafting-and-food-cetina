export const siteName = "Rafting & Food Cetina";

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/rafting", label: "Rafting" },
  { href: "/food", label: "Food Experience" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
] as const;

export const highlights = [
  {
    title: "Scenic Cetina experience",
    text: "A clear and inviting presentation of adventures, local atmosphere, and practical trip information."
  },
  {
    title: "Easy inquiry flow",
    text: "Visitors can quickly understand the offer and send a message without complex booking logic."
  },
  {
    title: "Mobile-friendly structure",
    text: "Clean sections, readable spacing, and a simple navigation pattern prepared for later polish."
  }
];

export const raftingPoints = [
  "Half-day rafting route with beginner-friendly energy",
  "Professional guides and safety equipment",
  "Stops for swimming, relaxing, and river viewpoints",
  "Suitable placeholder structure for families, couples, and groups"
];

export const foodPoints = [
  "Traditional local meal after the river experience",
  "Space for homemade specialties, drinks, and seasonal ingredients",
  "Flexible for group lunches, private events, or custom packages",
  "Simple explanation of what guests can expect before booking"
];

export const galleryNotes = [
  "Wide hero photos from the river and canyon",
  "Short video clips for social proof and atmosphere",
  "Portrait and landscape media prepared for mobile screens",
  "Organized categories for rafting, food, and surrounding nature"
];

export const faqItems = [
  {
    question: "Do I need rafting experience?",
    answer:
      "No. The current placeholder content is written for beginners and mixed groups. We can later fine-tune the wording for age limits, river level, and activity intensity."
  },
  {
    question: "What should guests bring?",
    answer:
      "A swimsuit, towel, dry clothes, and a good mood. Later we can add a precise checklist with shoes, meeting details, and optional extras."
  },
  {
    question: "Is food included in every package?",
    answer:
      "Not necessarily. We can present food as a separate experience or as part of a rafting and meal package depending on your offer."
  },
  {
    question: "How do inquiries work without a database?",
    answer:
      "The website can send a message directly to your email through a lightweight form service or serverless function. No traditional database is required."
  }
];

export const contactDetails = [
  { label: "Phone", value: "+385 XX XXX XXXX" },
  { label: "Email", value: "info@raftingandfood.com" },
  { label: "Location", value: "Omis / Cetina area, Croatia" },
  { label: "Availability", value: "Daily inquiries during the season" }
];
