import { GetServerSideProps } from "next/types";
import { JWTData } from "../../lib/types";
import { parseJWT } from "../../lib/functions";
import { LinkButton } from "../../components/linkbutton";

export interface ProfilePageProps {
  data: JWTData;
}

export default function ProfilePage({ data }: ProfilePageProps) {
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
      <h1>Profile Informations :</h1>
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
        <p>
          <strong>Email:</strong> {data.email}
        </p>
      </div>
      <LinkButton variant={"danger"} href={`/logout`}>
        Déconnexion
      </LinkButton>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = parseJWT(context.req.cookies.token);
  return {
    props: {
      data,
    },
  };
};
