import React from "react";
import { Visit } from "@/components/visit/jumlah";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Visit Jumlah - SA Marketing",
  description: "SA Marketing",
};


const VisitJumlahPage = () => {
  return (<Visit />)
};

export default VisitJumlahPage;
