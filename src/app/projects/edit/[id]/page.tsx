import CreateEditProject from "@/components/forms/create-edit-project";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CreateEditProject projectId={id} isEdit={true} isDetails={false} />;
}
