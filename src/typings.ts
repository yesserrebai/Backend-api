

  export interface UserPayload{
    id:string;
    email:string;
    role:string
}

export interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    // add other user properties here
  };
}