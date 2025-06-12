import PageLayout from "../components/PageLayout";

export default function Home() {
  return <PageLayout title = "Inicio" breadcrumbs={["Home"]}>
      <h1>Home</h1>
    </PageLayout>
}