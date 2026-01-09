import { clearToken, getRefreshToken, getToken, setToken } from "shared/lib"
import { warehouseApi } from "./init"
import { ConfigurationParameters, RequestContext, ResponseContext } from "./warehouse-back/_generated"

export const baseConfig: ConfigurationParameters = {
  fetchApi: fetch,
}

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async (): Promise<string | null> => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken()
      if (!refreshToken) {
        await clearToken()
        return null
      }

      const response = await warehouseApi.authentication.refresh({
        refreshToken,
      })

      if (response.accessToken && response.refreshToken) {
        await setToken(response.accessToken, response.refreshToken, response.expiresIn)
        return response.accessToken
      }

      await clearToken()
      return null
    } catch (error) {
      console.error("Token refresh failed:", error)
      await clearToken()
      return null
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
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
  // If we get a 401, try to refresh the token
  if (context.response.status === 401) {
    const url = context.url

    // Don't try to refresh on auth endpoints
    if (url.includes("/api/auth/login") || url.includes("/api/auth/refresh")) {
      await clearToken()
      return
    }

    const newToken = await refreshAccessToken()

    if (!newToken) {
      // Refresh failed, redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      return
    }

    // Retry the original request with the new token
    const retryContext = {
      ...context,
      init: {
        ...context.init,
        headers: {
          ...context.init.headers,
          Authorization: `Bearer ${newToken}`,
        },
      },
    }

    const retryResponse = await fetch(context.url, retryContext.init)

    // Replace the response with the retry response
    Object.defineProperty(context, "response", {
      value: retryResponse,
      writable: true,
    })
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
