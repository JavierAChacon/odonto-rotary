export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type AuthResponse<ResponseBody> = {
  data: ResponseBody | null
  error: { message?: string; status: number; code?: string } | null
}

export const unwrapAuthResponse = <ResponseBody>({
  data,
  error,
}: AuthResponse<ResponseBody>) => {
  if (error) {
    throw new ApiError(error.message ?? '', error.status, error.code)
  }
  return data
}
