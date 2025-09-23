// src/middleware/validate.js
export function validateBody(schema: {
    [key: string]: {type: string; required?: boolean; min?: number; max?: number};
}): (req: any, res: any, next: any) => void {
    return (req, res, next) => {
        const errors = [];
        for (const field in schema) {
            const rules = schema[field];
            const value = req.body[field];

            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push(`${field} is required`);
                continue;
            }

            if (value !== undefined && value !== null) {
                if (rules.type === 'string') {
                    if (typeof value !== 'string') {
                        errors.push(`${field} must be a string`);
                        continue;
                    }
                    if (rules.min && value.length < rules.min) {
                        errors.push(`${field} must be at least ${rules.min} characters`);
                    }
                    if (rules.max && value.length > rules.max) {
                        errors.push(`${field} must be at most ${rules.max} characters`);
                    }
                } else if (rules.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (typeof value !== 'string' || !emailRegex.test(value)) {
                        errors.push(`${field} must be a valid email`);
                    }
                } else if (rules.type === 'number') {
                    if (typeof value !== 'number') {
                        errors.push(`${field} must be a number`);
                        continue;
                    }
                    if (rules.min && value < rules.min) {
                        errors.push(`${field} must be at least ${rules.min}`);
                    }
                    if (rules.max && value > rules.max) {
                        errors.push(`${field} must be at most ${rules.max}`);
                    }
                }
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({errors});
        }

        next();
    };
}