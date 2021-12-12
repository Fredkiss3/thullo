import { JWTData } from "./types";
import { NextRequest } from "next/server";

export function parseQueryStringFromURL(url: string): {
  [key: string]: string;
} {
  const queryString = url.split("?")[1];
  const params = queryString?.split("&") ?? [];
  const query: { [key: string]: string } = {};

  for (const param of params) {
    const [key, value] = param.split("=");
    query[key] = value;
  }

  return query;
}

export function parseJWT(token: string): JWTData {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    Buffer.from(base64, "base64") // decode base64
      .toString("utf8") // convert to utf8
  );

  return JSON.parse(jsonPayload);
}

export async function fetchAuthenticated(
  req: NextRequest,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${req.cookies.token}`,
    },
    ...options,
  });
}

export function getHostWithScheme(host: string): string {
  // if the host is in localhost you return http:{host}
  if (host.includes("localhost")) {
    return `http://${host}`;
  } else {
    return `https://${host}`;
  }
}
