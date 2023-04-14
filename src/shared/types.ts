export declare type ResponseStatusType = {
  status: boolean;
  message: Object | String;
};

export declare type PaginationType = {
  take?: string | undefined;
  skip?: string | undefined;
};

export declare type ListResult<Type> = {
  list: Type[];
  count: number;
};
export declare type AuthenticatedUser<Type> = {
  user: Type;
  accessToken: String;
};
