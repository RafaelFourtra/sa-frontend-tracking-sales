import React from "react";
import { SalesIndividu } from "@/components/master/sales-individu";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sales Individu - SA Marketing",
  description: "SA Marketing",
};


const SalesIndividuPage = () => {
  return (<SalesIndividu />)
};

export default SalesIndividuPage;
