import type { Metadata } from "next";
import { HomePage } from "@/src/features/home/HomePage";

export const metadata: Metadata = {
  title: "Pocket Chef | Inicio",
  description:
    "Encuentra recetas por ingredientes, categorias y modo guiado paso a paso.",
};

export default function Home() {
  return <HomePage />;
}
