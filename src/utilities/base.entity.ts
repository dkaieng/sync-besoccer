import { ObjectId } from 'mongodb';

export abstract class BaseEntity {
  _id: ObjectId
  destroy: boolean
  createdBy: string
  updatedBy: string
  _v: number

  constructor() {
    this._id = new ObjectId();
    this.destroy = false;
    this.createdBy = '';
    this.updatedBy = '';
    this._v = 0;
  } 
}