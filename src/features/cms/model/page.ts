export type CmsSlot = {
  id: string;
  slot: string;
  type: string;
  config?: unknown;
  data?: unknown;
};

export type CmsBlock = {
  id: string;
  position: number;
  slots: CmsSlot[];
  type: string;
  cssClass?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
};

export type CmsSection = {
  blocks: CmsBlock[];
  id: string;
  position: number;
  type: string;
  cssClass?: string;
  sizingMode?: string;
};

export type CmsPage = {
  id: string;
  sections: CmsSection[];
  type: string;
  cssClass?: string;
};
