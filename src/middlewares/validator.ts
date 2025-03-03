import { ObjectSchema, ValidationOptions ,ArraySchema } from 'joi'
import { StatusCodes } from 'http-status-codes'
import * as express from 'express'

const OPTS: ValidationOptions = {
    abortEarly: false,
    messages: {
        key: '{{key}}'
    }
}

export function Validator(schema: ObjectSchema | ArraySchema): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        const params = req.method === 'GET' ? req.params : req.body;
        const { error } = schema.validate(params, OPTS);
        
        if (error) {
            const errorMessages = error.details.map(item => item.message);
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: errorMessages
            });
            return;
        }
        next();
    };
}