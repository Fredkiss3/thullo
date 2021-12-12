import { LinkButton } from "../components/linkbutton";
import { Seo } from "../components/seo";

export interface HomePageProps {}

export default function Home(props: HomePageProps) {
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
      <Seo />
      <h1>Thullo</h1>
      <LinkButton variant={"outline"} href={"/login"}>
        Connexion
      </LinkButton>
    </div>
  );
}
