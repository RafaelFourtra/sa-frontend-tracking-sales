import React from "react";
import { SalesManCreate } from "@/components/master/sales-man/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sales Man Create - SA Marketing",
  description: "SA Marketing",
};


const SalesManCreatePage = () => {
  return (<SalesManCreate />)
};

export default SalesManCreatePage;
