import { body, validationResult } from "express-validator";
/**
 * Higher-order function that creates a middleware for running validation chains
 * @param {ValidationChain[]} validations - Array of validation chains to execute
 * @returns {Function} Express middleware function
 */
export const validate = (validations) => {
    return async (req, res, next) => {
        // Execute each validation chain
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }
        // Check for any validation errors
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        // Return 422 Unprocessable Entity if validation fails
        return res.status(422).json({ errors: errors.array() });
    };
};
/**
 * Validation chain for user signup
 * Validates name, email, and password fields
 */
export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];
/**
 * Validation chain for user login
 * Validates email and password fields
 */
export const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
];
/**
 * Validation chain for chat completion requests
 * Validates message field
 */
export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Message is required"),
];
//# sourceMappingURL=validators.js.map