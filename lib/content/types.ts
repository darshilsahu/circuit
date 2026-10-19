export type Section = { heading: string; paragraphs: string[]; code?: string; output?: string };
export type Guide = { slug: string; title: string; description: string; intro: string; sections: Section[]; related: string[]; example: string };
export type Example = { slug: string; title: string; category: string; description: string; code: string; input?: string; output: string; explanation: string[]; concepts: string[]; guide: string };
