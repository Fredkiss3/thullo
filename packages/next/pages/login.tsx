export interface LoginPageProps {}

export default function LoginPage(props: LoginPageProps) {
  function getAuthURL(provider: string): URLSearchParams {
    const params = new URLSearchParams();
    params.append("response_type", "code");
    params.append("client_id", "6Oca5cWftabV050Or7ZfESJ4LIR5kICw");
    params.append("redirect_uri", "http://localhost:3000/profile");
    params.append("connection", provider);
    params.append("scope", "openid profile email");

    return params;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "underline",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <a
        href={`https://dev-7tket-qt.us.auth0.com/authorize?${getAuthURL(
          "google-oauth2"
        ).toString()}`}
      >
        Login With Google
      </a>
      <a
        href={`https://dev-7tket-qt.us.auth0.com/authorize?${getAuthURL(
          "github"
        ).toString()}`}
      >
        Login With Github
      </a>
    </div>
  );
}
