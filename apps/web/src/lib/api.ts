import { getApiUrl } from "./utils";

type FetchOptions = RequestInit & { auth?: boolean };

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { auth = false, headers, ...rest } = options;
  const url = getApiUrl(path);

  const res = await fetch(url, {
    ...rest,
    credentials: auth ? "include" : (rest.credentials ?? "same-origin"),
    headers: {
      ...(rest.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...headers,
    },
    cache: rest.cache ?? (auth ? "no-store" : undefined),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? "Request failed");
  }

  return res.json() as Promise<T>;
}

export async function apiFetchServer<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = getApiUrl(path);
  const res = await fetch(url, {
    ...options,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
