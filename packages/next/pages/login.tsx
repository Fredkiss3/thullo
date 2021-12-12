import { LinkButton } from "../components/linkbutton";
import { Icon } from "../components/icon";
import { Seo } from "../components/seo";
import type { GetServerSideProps } from "next/types";
import { Alert } from "../components/alert";

export interface LoginPageProps {
  errors?: Record<string, string[]>;
}

export default function LoginPage({ errors }: LoginPageProps) {
  function getAuthURL(provider: string): URLSearchParams {
    const params = new URLSearchParams();
    params.append("response_type", "code");
    params.append("client_id", "6Oca5cWftabV050Or7ZfESJ4LIR5kICw");
    params.append("redirect_uri", "http://localhost:3000/callback");
    params.append("connection", provider);
    params.append("scope", "openid profile email");

    return params;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Seo title="Login" />
      <h1>Connexion</h1>

      {errors && (
        <Alert type={'danger'}>
          <div>
            {Object.keys(errors).map((key) => (
              <span key={key}>{errors[key]}</span>
            ))}
          </div>
        </Alert>
      )}
      <LinkButton
        external
        variant={"primary"}
        href={`https://dev-7tket-qt.us.auth0.com/authorize?${getAuthURL(
          "google-oauth2"
        ).toString()}`}
        renderIcon={(classNames) => (
          <Icon className={classNames} icon={"google"} />
        )}
      >
        Continuer avec Google
      </LinkButton>
      <LinkButton
        variant={"black"}
        external
        href={`https://dev-7tket-qt.us.auth0.com/authorize?${getAuthURL(
          "github"
        ).toString()}`}
        renderIcon={(classNames) => (
          <Icon className={classNames} icon={"github"} />
        )}
      >
        Continuer avec Github
      </LinkButton>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;

  try {
    if (query.errors) {
      return {
        props: {
          errors: JSON.parse(query.errors as string),
        },
      };
    }
  } catch (e) {
    // Do nothing
  }

  return {
    props: {},
  };
};