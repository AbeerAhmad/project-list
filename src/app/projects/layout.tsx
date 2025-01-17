import React from "react";

import ProjectLayout from "./_component/project-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProjectLayout>{children}</ProjectLayout>;
}
