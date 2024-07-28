export type ContactType = {
  name: string;
  phone: string;
};

export enum IndustryEnum {
  RESTAURANTS = "restaurants",
  STORES = "stores",
  WHOLESALE = "wholesale",
  SERVICES = "services",
}

export enum WorkflowStagesEnum {
  NEW = "New",
  MARKET_APPROVED = "Market Approved",
  MARKET_DECLINED = "Market Declined",
  SALES_APPROVED = "Sales Approved",
  WON = "Won",
  LOST = "Lost",
}
