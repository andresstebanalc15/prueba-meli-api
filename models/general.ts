import { Send, Query } from 'express-serve-static-core';

export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

export interface TypedRequestParams<T extends Query> extends Express.Request {
  params: T;
}

export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}
