import React from "react";
import { Sales } from "@/components/master/sales";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sales - SA Marketing",
  description: "SA Marketing",
};


const SalesPage = () => {
  return (<Sales />)
};

export default SalesPage;
