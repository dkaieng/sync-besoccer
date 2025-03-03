import Joi from "joi"

const addScore = Joi.object({
    score: Joi.number().required(),
    nickName: Joi.string().required(),
    createdBy: Joi.string().required(),
    updatedBy: Joi.string().required(),
    _v: Joi.number().required()
})

const updateAllScores = Joi.array().items(Joi.object({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
    score: Joi.number().required(),
    nickName: Joi.string().required(),
    createdBy: Joi.string().required(),
    updatedBy: Joi.string().required(),
    _v: Joi.number().required(),
})).required();

const UserScoreValidation = { addScore, updateAllScores }
export default UserScoreValidation