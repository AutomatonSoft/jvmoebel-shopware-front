export type CmsSlot = {
  id: string;
  slot: string;
  type: string;
  config?: unknown;
  data?: unknown;
};

export type CmsVisibility = Readonly<{
  desktop?: boolean;
  mobile?: boolean;
  tablet?: boolean;
}>;

export type CmsBackgroundMediaMode = "auto" | "contain" | "cover";

export type CmsBlock = {
  backgroundColor?: string;
  backgroundMediaMode?: CmsBackgroundMediaMode;
  backgroundMediaUrl?: string;
  cssClass?: string;
  id: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  position: number;
  sectionPosition?: string;
  slots: CmsSlot[];
  type: string;
  visibility?: CmsVisibility;
};

export type CmsSection = {
  backgroundColor?: string;
  backgroundMediaMode?: CmsBackgroundMediaMode;
  backgroundMediaUrl?: string;
  blocks: CmsBlock[];
  cssClass?: string;
  id: string;
  mobileBehavior?: string;
  position: number;
  sizingMode?: string;
  type: string;
  visibility?: CmsVisibility;
};

export type CmsPage = {
  backgroundColor?: string;
  cssClass?: string;
  id: string;
  sections: CmsSection[];
  type: string;
};
