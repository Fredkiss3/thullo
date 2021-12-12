import type { NextFetchEvent, NextRequest } from "next/server";
import type { ApiResult, ApiErrors } from "../../lib/types";
import { NextResponse } from "next/server";
import { parseQueryStringFromURL } from "../../lib/functions";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const query = parseQueryStringFromURL(req.url);

  let errorsObject: ApiErrors = {
    message: ["Veuillez vous connecter."],
  };

  if (query?.code) {
    const res = await fetch(`${process.env.API_URL}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authCode: query.code,
      })
    });

    const { data, errors }: ApiResult<{ token: string }> = await res.json();

    if (!errors) {
      // Should redirect to /profile
      const response = NextResponse.redirect(`/profile`, 302);

      // set the user cookie
      response.cookie("token", data.token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false,
      });
      return response;
    } else {
      errorsObject = errors;
    }
  }

  // redirect to login
  return NextResponse.redirect(
    `/login?errors=${encodeURIComponent(JSON.stringify(errorsObject))}`,
    302
  );
}
