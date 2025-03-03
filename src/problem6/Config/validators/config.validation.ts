import Joi from "joi"

const createConfig = Joi.object({
    isAddScoreEnabled: Joi.boolean().required(),
    createdBy: Joi.string().required(),
    updatedBy: Joi.string().required(),
})

const updateConfig = Joi.object({
    isAddScoreEnabled: Joi.boolean().required(),
    _v: Joi.number().required()
})

const UserScoreValidation = { createConfig, updateConfig }
export default UserScoreValidation