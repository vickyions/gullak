import { body } from "express-validator";

type Length = {
  max?: number;
  min?: number;
};

export const emailValidator = (field: string) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} Must not be empty`)
    .isEmail()
    .withMessage(`${field} Must be a valid email`)
    .normalizeEmail({ all_lowercase: true })
    .escape();

export const alphaNumValidator = (field: string, length?: Length) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} Must not be empty`)
    .isAlphanumeric()
    .withMessage(`${field} Must be AlphaNumeric`)
    .isLength({ max: length?.max || 300, min: length?.min || 1 })
    .withMessage(
      `${field} Length must be between ${length?.max} to ${length?.min}`
    )
    .escape();

export const alphaValidator = (field: string, length?: Length) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} Must not be empty`)
    .isAlpha()
    .withMessage(`${field} Must be Alpha`)
    .isLength({ max: length?.max || 300, min: length?.min || 1 })
    .withMessage(
      `${field} Length must be between ${length?.max} to ${length?.min}`
    )
    .escape();

export const nameValidator = (field: string, length?: Length) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} Must not be empty`)
    .matches(/^[a-zA-Z ]+$/)
    .withMessage(`${field} must only contain letters and spaces`)
    .isLength({ max: length?.max || 300, min: length?.min || 1 })
    .withMessage(
      `${field} Length must be between ${length?.max} to ${length?.min}`
    )
    .escape();

export const passwordValidator = (field: string, length?: Length) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} Must not be empty`)
    .isStrongPassword({
      minLength: 8,
      minLowercase: 2,
      minNumbers: 2,
      minSymbols: 2,
      minUppercase: 2,
    })
    .withMessage(
      `${field} must satisfy 8 minlength, 2 lowercase, 2 uppercase, 2 symbols, 2 numbers`
    )
    .isLength({ max: length?.max || 300, min: length?.min || 1 })
    .withMessage(
      `${field} Length must be between ${length?.max} to ${length?.min}`
    )
    .escape();

export const numValidator = (field: string) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} Must not be empty`)
    .isNumeric()
    .withMessage(`${field} Must be Alpha`)
    .escape();
