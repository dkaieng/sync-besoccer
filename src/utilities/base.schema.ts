export const baseSchemaFields = {
  destroy: {
    type: Boolean,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  },
  _v: {
    type: Number,
    default: 0
  },
};

export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false,
};
