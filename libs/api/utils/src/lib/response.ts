export type ResponseDataType<T> = {
  data: T;
  statusCode: 200 | 201;
  message: string;
  pagination?: {
    page: number;
    size: number;
    totalSize: number;
    totalPages: number;
  };
};

export type ThrowResponse = {
  statusCode: number;
  message: string;
  reasons: string;
};

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export const HttpStatusCode: Record<number, string> = {
  200: 'The request was successful',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};

export function throwResponse({ message, reasons, statusCode }: ThrowResponse) {
  const result = {
    statusCode,
    message: message || HttpStatusCode[statusCode],
    reasons,
  };

  return result;
}

export function responseData<T>({
  statusCode,
  data,
  message,
  pagination,
}: ResponseDataType<T>) {
  return Array.isArray(data)
    ? pagination
      ? {
          data: [...data],
          statusCode,
          message: message || HttpStatusCode[statusCode],
          pagination,
        }
      : {
          data: [...data],
          statusCode,
          message: message || HttpStatusCode[statusCode],
        }
    : { data, statusCode, message: message || HttpStatusCode[statusCode] };
}
