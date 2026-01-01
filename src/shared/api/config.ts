import { clearToken, getToken } from "shared/lib"
import { ConfigurationParameters, RequestContext, ResponseContext } from "./warehouse-back/_generated"

export const baseConfig: ConfigurationParameters = {
  fetchApi: fetch,
}

const authPreMiddleware = async (context: RequestContext) => {
  const token = await getToken()
  if (token) {
    context.init.headers = {
      ...context.init.headers,
      Authorization: `Bearer ${token}`,
    }
  }
}

const postAuthPreMiddleware = async (context: ResponseContext) => {
  if (context.response.status === 401) {
    await clearToken()
  }
}

export const browserConfig: ConfigurationParameters = {
  ...baseConfig,
  middleware: [
    {
      pre: authPreMiddleware,
      post: postAuthPreMiddleware,
    },
  ],
}

export const serverConfig: ConfigurationParameters = {
  ...baseConfig,

  middleware: [
    {
      pre: authPreMiddleware,
      post: postAuthPreMiddleware,
    },
  ],
}
