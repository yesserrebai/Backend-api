import { Query } from 'mongoose';

export class APIFeatures<T extends Query<any, any>, U> {
  query: T;
  queryString: U;

  constructor(query: T, queryString: U){
    this.query = query;
    this.queryString = queryString;
  }

  paginating(){
    const page = (this.queryString as any).page * 1 || 1; 
    const limit = (this.queryString as any).limit * 1 || 9;
    const skip = (page -1) * limit; 
    this.query = (this.query as any).skip(skip).limit(limit);
    return this;
  }
}