export type ServiceLineItem = object;

export type ProductLineItem = object;

export type LineItem = {
  key: string;
  name: string;
  description: string;
  detail: ServiceLineItem | ProductLineItem;
};
