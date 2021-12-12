import type { NextFetchEvent, NextRequest } from "next/server";import type { ApiResult, ApiErrors } from "../../lib/types";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const response = NextResponse.redirect(
    `/login?success=${encodeURIComponent(
      JSON.stringify({ message: "Logged out" })
    )}`
  );

  // empty the cookies
  response.cookie("token", "", {
    path: "/",
    maxAge: -1,
    httpOnly: true,
  });

  // redirect to login
  return response;
}
