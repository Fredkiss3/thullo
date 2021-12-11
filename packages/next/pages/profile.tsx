import Link from "next/link";
import { GetServerSideProps } from "next/types";

export interface CallBackPageProps {
  data: {
    login: string;
    name: string;
    avatarURL: string | null;
  };
  errors: {
    [key: string]: [string];
  };
}

export default function CallBackPage({ data }: CallBackPageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        Profile Informations : <pre>{JSON.stringify(data, null, 4)}</pre>
      </div>
      <div>
        <img src={data.avatarURL} alt={data.name} />
      </div>
      <div>
        <p>
          <strong>Name:</strong> {data.name}
        </p>
        <p>
          <strong>Login:</strong> {data.login}
        </p>
      </div>

      <div
        style={{
          textDecoration: "underline",
        }}
      >
        <Link href={"/login"}>Reconnectez-vous</Link>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query;

  const res = await fetch(`http://localhost:3031/api/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authCode: query.code,
    }),
  });
  const { data, errors }: CallBackPageProps = await res.json();

  return {
    props: {
      data,
      errors,
    },
  };
};
