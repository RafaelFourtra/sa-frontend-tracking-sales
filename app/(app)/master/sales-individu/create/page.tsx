import React from "react";
import { SalesIndividuCreate } from "@/components/master/sales-individu/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sales Individu Create - SA Marketing",
  description: "SA Marketing",
};


const SalesIndividuCreatePage = () => {
  return (<SalesIndividuCreate />)
};

export default SalesIndividuCreatePage;
