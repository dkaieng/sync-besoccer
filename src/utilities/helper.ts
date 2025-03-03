import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { Response } from 'express'

export function sendErrorResponse(e: any, res: Response): void {
    const statusCode = e.code || 500;
    const errorMessage = e.message || 'An unexpected error occurred';

    res.status(statusCode).json({
        error: {
            code: statusCode,
            message: errorMessage,
            details: e.details || null,
        },
    });
}

export const sendSuccessReponse = (data: any, res: Response) => {
    return res.json(data)
}

export const errorHandlers = (error: any, res: Response) => {
	if (error.code === 11000) {
		let message = 'Some field(s) already existed'
		let { code } = error
		if (error.keyValue) {
			const duplicateKey = Object.keys(error.keyValue)[0]
			const duplicateValue = error.keyValue[duplicateKey]
			message = `${duplicateKey}: ${duplicateValue} already existed`
			code = StatusCodes.CONFLICT
		}
		if (error.writeErrors?.length) {
			message = error.writeErrors[0].err?.errmsg
			code = StatusCodes.CONFLICT
		}
		sendErrorResponse(
			{
				success: false,
				code: StatusCodes[code] ? code : StatusCodes.INTERNAL_SERVER_ERROR,
				message
			},
			res
		)
	} else {
		sendErrorResponse(
			{
				success: false,
				code: StatusCodes[error.code] ? error.code : StatusCodes.INTERNAL_SERVER_ERROR,
				message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
			},
			res
		)
	}
}