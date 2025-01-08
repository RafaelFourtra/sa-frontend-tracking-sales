import React from "react";
import { SalesIndividuEdit } from "@/components/master/sales-individu/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sales Individu Edit - SA Marketing",
  description: "SA Marketing",
};


const SalesIndividuEditPage = () => {
  return (<SalesIndividuEdit />)
};

export default SalesIndividuEditPage;
