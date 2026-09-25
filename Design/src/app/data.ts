export const images = {
  city: "https://images.unsplash.com/photo-1672872476232-da16b45c9001?auto=format&fit=crop&w=1200&q=85",
  alley: "https://images.unsplash.com/photo-1563863251222-11d3e3bd3b62?auto=format&fit=crop&w=1200&q=85",
  arcade: "https://images.unsplash.com/photo-1560671021-cb36f70ce82d?auto=format&fit=crop&w=1200&q=85",
  night: "https://images.unsplash.com/photo-1653142267767-a66c7cf17bc1?auto=format&fit=crop&w=1200&q=85",
  stairs: "https://images.unsplash.com/photo-1555852224-2a3e675fc47e?auto=format&fit=crop&w=1200&q=85",
};

export type Creator = {
  name: string;
  handle: string;
  role: string;
  initials: string;
  color: string;
  rate: string;
  available: boolean;
  skills: string[];
  followers: string;
};

export const creators: Creator[] = [
  {
    name: "Maya Chen",
    handle: "@mayabuilds",
    role: "3D Environment Artist",
    initials: "MC",
    color: "from-emerald-300 to-cyan-700",
    rate: "$35/hr",
    available: true,
    skills: ["Blender", "Low-poly", "Lighting"],
    followers: "4.8k",
  },
  {
    name: "Alex Rivera",
    handle: "@rivscripts",
    role: "Luau Systems Engineer",
    initials: "AR",
    color: "from-lime-300 to-emerald-800",
    rate: "$42/hr",
    available: true,
    skills: ["Luau", "Datastores", "Combat"],
    followers: "3.1k",
  },
  {
    name: "Noor El-Amin",
    handle: "@noorinterface",
    role: "UI / UX Designer",
    initials: "NE",
    color: "from-teal-200 to-green-700",
    rate: "$30/hr",
    available: false,
    skills: ["Figma", "UI Motion", "Icons"],
    followers: "2.6k",
  },
  {
    name: "Jay Park",
    handle: "@jayfx",
    role: "VFX Artist",
    initials: "JP",
    color: "from-green-200 to-cyan-800",
    rate: "$38/hr",
    available: true,
    skills: ["Particles", "Shaders", "Animation"],
    followers: "5.3k",
  },
];

export const projects = [
  { title: "Neon District", creator: "Maya Chen", role: "3D Art", image: images.alley, likes: "2.4k", views: "18k" },
  { title: "Phantom Arena", creator: "Alex Rivera", role: "Scripting", image: images.city, likes: "1.8k", views: "12k" },
  { title: "Rift Inventory", creator: "Noor El-Amin", role: "UI Design", image: images.arcade, likes: "986", views: "8.6k" },
  { title: "Cyber Bloom VFX", creator: "Jay Park", role: "VFX", image: images.night, likes: "3.2k", views: "24k" },
  { title: "Overgrown Temple", creator: "Maya Chen", role: "3D Art", image: images.stairs, likes: "1.1k", views: "9.4k" },
  { title: "Round System Pro", creator: "Alex Rivera", role: "Scripting", image: images.city, likes: "742", views: "6.2k" },
];

export const jobs = [
  { title: "Lead Scripter for PvP RPG", studio: "Moonforge Studio", budget: "$2,000–$4,000", type: "Contract", tags: ["Luau", "Combat", "Datastores"], age: "2h ago" },
  { title: "Stylized Environment Artist", studio: "Nightjar Games", budget: "$35–$50/hr", type: "Part-time", tags: ["Blender", "Texturing", "Lighting"], age: "5h ago" },
  { title: "UI Designer for Simulator", studio: "Pixel Foundry", budget: "$800–$1,200", type: "Project", tags: ["Figma", "UI/UX", "Mobile"], age: "1d ago" },
  { title: "VFX Artist — Magic System", studio: "Ash & Ember", budget: "$40/hr", type: "Contract", tags: ["Particles", "Shaders", "Magic"], age: "1d ago" },
];
