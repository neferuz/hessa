import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz | HESSA",
  description: "Quiz",
};

export default function QuizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
