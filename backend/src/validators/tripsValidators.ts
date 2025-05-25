import { NextFunction, Request, Response } from "express";

const { body, check, validationResult } = require("express-validator");

export const createTripsValidator = [
  body()
    .custom((value: any, { req }: { req: Request }) => {
      const objectKeys = Object.keys(req.body);
      const fields = [
        "departureDate",
        "destination",
        "driver",
        "fuel",
        "liters",
        "origin",
        "status",
        "truck",
      ];

      return !objectKeys.some((key) => !fields.includes(key));
    })
    .withMessage(
      "The only fields allowed are: departureDate, destination, driver, fuel, liters, origin, status and truck"
    ),
  check("departureDate")
    .exists()
    .withMessage("Field departureDate is required")
    .isString()
    .withMessage("Field departureDate must be a string")
    .custom((value: string) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(
          "departureDate debe ser una fecha válida en formato ISO"
        );
      }

      const now = new Date();
      if (date <= now) {
        throw new Error(
          "departureDate debe ser una fecha posterior a la actual"
        );
      }

      return true;
    }),
  check("destination")
    .exists()
    .withMessage("Field destination is required")
    .isString()
    .withMessage("Field destination must be a string"),
  check("driver")
    .exists()
    .withMessage("Field driver is required")
    .isString()
    .withMessage("Field driver must be a string"),
  check("fuel")
    .exists()
    .withMessage("Field fuel is required")
    .isString()
    .withMessage("Field fuel must be a string"),
  check("liters")
    .exists()
    .withMessage("Field liters is required")
    .isInt({ min: 0, max: 30000 })
    .withMessage("Field liters must be a number between 0 and 30000"),
  check("origin")
    .exists()
    .withMessage("Field origin is required")
    .isString()
    .withMessage("Field origin must be a string"),
  check("status")
    .optional()
    .isString()
    .withMessage("Field status must be a string")
    .isIn(["sin_iniciar", "en_transito", "completado"]),
  check("truck")
    .exists()
    .withMessage("Field truck is required")
    .isString()
    .withMessage("Field truck must be a string"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      validationResult(req).throw();
      return next();
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
];

export const updateTripsValidator = [
  body()
    .custom((value: any, { req }: { req: Request }) => {
      const objectKeys = Object.keys(req.body);
      const fields = [
        "createdAt",
        "updatedAt",
        "__v",
        "_id",
        "destination",
        "fuel",
        "liters",
        "origin",
        "status",
        "truck",
      ];

      return !objectKeys.some((key) => !fields.includes(key));
    })
    .withMessage(
      "The only fields allowed are: destination, fuel, liters, origin, status and truck"
    ),
  check("destination")
    .optional()
    .isString()
    .withMessage("Field destination must be a string"),
  check("fuel")
    .optional()
    .isString()
    .withMessage("Field fuel must be a string"),
  check("liters")
    .optional()
    .isInt({ min: 0, max: 30000 })
    .withMessage("Field liters must be a number between 0 and 30000"),
  check("origin")
    .optional()
    .isString()
    .withMessage("Field origin must be a string"),
  check("status")
    .optional()
    .isString()
    .withMessage("Field status must be a string"),
  check("truck")
    .optional()
    .isString()
    .withMessage("Field truck must be a string"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      validationResult(req).throw();
      return next();
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
];
