import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ApiErrors, ApiResult } from "../../lib/types";
import { fetchAuthenticated } from "../../lib/functions";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  let errorsObject: ApiErrors = {
    message: ["Veuillez vous connecter, pour avoir accès à cette page."],
  };

  if (req.cookies.token) {
    const res = await fetchAuthenticated(req, `${process.env.API_URL}/api/auth/check-jwt`);

    const { errors }: ApiResult<{ success: boolean }> = await res.json();

    if (errors) {
      return NextResponse.redirect(
        `/login?errors=${encodeURIComponent(JSON.stringify(errors))}`,
        302
      );
    }
  } else {
    return NextResponse.redirect(
      `/login?errors=${encodeURIComponent(JSON.stringify(errorsObject))}`,
      302
    );
  }

  return NextResponse.next();
}
