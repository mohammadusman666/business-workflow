import bodyParser from "body-parser";
import express, { Request, Response } from "express";

import { Business } from "./business";
import { IndustryEnum, WorkflowStagesEnum } from "./types";
import { isValidFein } from "./utils";

const app = express();
app.use(bodyParser.json());

type Businesses = {
  [key: string]: Business;
};

const businesses: Businesses = {};

app.get("/", (request: Request, response: Response) => {
  return response.send("Business Workflow server running! Send POST request at: /create-business to create a new business.");
});

app.post("/create-business", (request: Request, response: Response) => {
  const { fein, name } = request.body;

  if (!fein || !name) {
    return response.status(400).json({ errorMessage: "Fein number and name are required." });
  }
  if (!isValidFein(fein)) {
    return response.status(400).json({ errorMessage: "Fein must be a 9-digit number." });
  }
  if (businesses[fein]) {
    return response
      .status(400)
      .json({ errorMessage: "Business already exist against this fein number." });
  }

  const business = new Business(fein, name);
  businesses[fein] = business;

  response
    .status(201)
    .json({
      ...business,
      nextStep:
        "Send PUT request at: /business/:fein/progress to progress.",
    });
});

app.put("/business/:fein/progress", (request: Request, response: Response) => {
  const { fein } = request.params;
  const { industry, contact, status } = request.body;
  const business = businesses[fein];

  if (!business) {
    return response.status(404).json({ errorMessage: "Business not found." });
  }

  switch (business.currentStage) {
    case WorkflowStagesEnum.NEW:
      if (!industry) {
        return response
          .status(400)
          .json({ errorMessage: "Industry is required to progress." });
      }


      if (!(Object.values(IndustryEnum).includes(industry))) {
        return response
          .status(400)
          .json({
            errorMessage: `Target industry must be one of: ${Object.values(IndustryEnum).join(
              ", "
            )}.`,
          });
      }

      if ([IndustryEnum.RESTAURANTS, IndustryEnum.STORES].includes(industry)) {
        business.industry = industry;
        business.currentStage = WorkflowStagesEnum.MARKET_APPROVED;

        return response.json({
          business,
          nextStep: "Provide contact information to progress.",
        });
      } else {
        business.currentStage = WorkflowStagesEnum.MARKET_DECLINED;

        return response.json({ business });
      }
    case WorkflowStagesEnum.MARKET_APPROVED:
      if (!contact) {
        return response.status(400).json({
          errorMessage:
            "Contact is required.",
        });
      }

      if (!(contact.name && contact.phone)) {
        return response.status(400).json({
          errorMessage:
            "Valid contact comprises name and phone.",
        });
      }

      business.contact = contact;
      business.currentStage = WorkflowStagesEnum.SALES_APPROVED;

      return response.json({
        business,
        nextStep: "Choose Won or Lost to complete the workflow.",
      });
    case WorkflowStagesEnum.SALES_APPROVED:
      if (
        !status ||
        (status !== WorkflowStagesEnum.WON && status !== WorkflowStagesEnum.LOST)
      ) {
        return response
          .status(400)
          .json({ errorMessage: "Status must be either 'Won' or 'Lost'." });
      }

      business.currentStage = status;

      return response.json({ business });
    default:
      return response
        .status(400)
        .json({ errorMessage: "No further progression possible." });
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
