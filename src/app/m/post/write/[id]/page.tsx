import HeaderPageComponent from "@components/sementic/m/header/header.component.tsx";
import WriteComponent from "@components/page/m/post/write/postWrite.component";
import FooterPageComponent from "@components/sementic/m/footer/footer.component";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WritePage({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;
  return (
    <>
      <HeaderPageComponent />
      <WriteComponent isEditMode={true} postId={Number(params.id)} />
      <FooterPageComponent />
    </>
  );
}