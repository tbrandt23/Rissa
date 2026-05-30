import { images } from "./images";

export type Variant = "full" | "split-left" | "split-right" | "diptych";

export type Capability = {
  number: string;
  title: string;
  kicker: string;
  description: string;
  tags: string[];
  variant: Variant;
  image: string;
  imageB?: string;
  ratio: "video" | "4/5" | "3/4" | "square";
};

export const capabilities: Capability[] = [
  {
    number: "01",
    title: "Aesthetic Curation",
    kicker: "Pre-production",
    description:
      "Mood, palette, and reference work that sets the tone before a single frame is shot.",
    tags: ["Mood", "Palette", "Reference"],
    variant: "full",
    image: images.aestheticCuration,
    ratio: "video",
  },
  {
    number: "02",
    title: "Creative Direction",
    kicker: "Brand",
    description:
      "Visual identity shaping and artist brand execution — the throughline that makes scattered work feel like a single hand.",
    tags: ["Identity", "Throughline", "Execution"],
    variant: "split-left",
    image: images.creativeDirection,
    ratio: "4/5",
  },
  {
    number: "03",
    title: "Styling",
    kicker: "On set",
    description: "Wardrobe, casting, and on-set styling for editorial and music.",
    tags: ["Wardrobe", "Casting", "Editorial"],
    variant: "diptych",
    image: images.stylingA,
    imageB: images.stylingB,
    ratio: "3/4",
  },
  {
    number: "04",
    title: "Event Planning",
    kicker: "Spaces",
    description:
      "Nights and rooms designed with the same eye as a record cover — every element edited.",
    tags: ["Nightlife", "Production", "Atmosphere"],
    variant: "full",
    image: images.eventPlanning,
    ratio: "video",
  },
  {
    number: "05",
    title: "Media Management",
    kicker: "Infrastructure",
    description:
      "Asset libraries, rollouts, and release cadences — quiet infrastructure behind public work.",
    tags: ["Assets", "Rollouts", "Cadence"],
    variant: "split-right",
    image: images.mediaManagement,
    ratio: "4/5",
  },
  {
    number: "06",
    title: "Image Direction",
    kicker: "Photography",
    description:
      "Photography supervision from pre-pro through final selects — protecting the look from drift.",
    tags: ["Pre-pro", "Supervision", "Selects"],
    variant: "full",
    image: images.imageDirection,
    ratio: "video",
  },
];
