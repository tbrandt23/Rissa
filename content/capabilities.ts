import { images } from "./images";

export type Variant = "full" | "split-left" | "split-right" | "diptych";

export type Capability = {
  number: string;
  title: string;
  description: string;
  variant: Variant;
  image: string;
  imageB?: string;
  ratio: "video" | "4/5" | "3/4" | "square";
};

export const capabilities: Capability[] = [
  {
    number: "01",
    title: "Aesthetic Curation",
    description:
      "Mood, palette, and reference work that sets the tone before a single frame is shot.",
    variant: "full",
    image: images.aestheticCuration,
    ratio: "video",
  },
  {
    number: "02",
    title: "Creative Direction",
    description:
      "Visual identity shaping and artist brand execution — the throughline that makes scattered work feel like a single hand.",
    variant: "split-left",
    image: images.creativeDirection,
    ratio: "4/5",
  },
  {
    number: "03",
    title: "Styling",
    description: "Wardrobe, casting, and on-set styling for editorial and music.",
    variant: "diptych",
    image: images.stylingA,
    imageB: images.stylingB,
    ratio: "3/4",
  },
  {
    number: "04",
    title: "Event Planning",
    description:
      "Nights and rooms designed with the same eye as a record cover — every element edited.",
    variant: "full",
    image: images.eventPlanning,
    ratio: "video",
  },
  {
    number: "05",
    title: "Media Management",
    description:
      "Asset libraries, rollouts, and release cadences — quiet infrastructure behind public work.",
    variant: "split-right",
    image: images.mediaManagement,
    ratio: "4/5",
  },
  {
    number: "06",
    title: "Image Direction",
    description:
      "Photography supervision from pre-pro through final selects — protecting the look from drift.",
    variant: "full",
    image: images.imageDirection,
    ratio: "video",
  },
];
