type ResponseDataType<T> = {
  data: T;
  code: 200;
  message: string;
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

export function responseData<T>({ code, data, message }: ResponseDataType<T>) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  const response = Array.isArray(data)
    ? { data: [...data], code, message: message || HttpStatusCode[code] }
    : { data, code, message: message || HttpStatusCode[code] };
  const responseInit: ResponseInit = { status: code, headers };
  return new Response(JSON.stringify(response), responseInit);
}
