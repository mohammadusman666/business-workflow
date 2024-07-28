import { ContactType, IndustryEnum, WorkflowStagesEnum } from "./types";

export class Business {
  feinNumber: string;
  name: string;
  industry?: IndustryEnum;
  contact?: ContactType;
  currentStage: WorkflowStagesEnum;

  constructor(
    feinNumber: string,
    name: string,
    industry?: IndustryEnum,
    contact?: ContactType
  ) {
    this.feinNumber = feinNumber;
    this.name = name;
    this.industry = industry;
    this.contact = contact;
    this.currentStage = WorkflowStagesEnum.NEW;
  }

  toJSON() {
    return {
      feinNumber: this.feinNumber,
      name: this.name,
      industry: this.industry,
      contact: this.contact,
      currentStage: this.currentStage,
    };
  }
}
