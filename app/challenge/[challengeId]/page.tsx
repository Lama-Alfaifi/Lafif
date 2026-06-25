import ChallengePage from "@/features/ai/components/ChallengePage";

export default async function Page({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = await params;
  return <ChallengePage challengeId={challengeId} />;
}
