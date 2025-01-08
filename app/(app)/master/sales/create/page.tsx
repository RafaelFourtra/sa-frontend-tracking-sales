import React from "react";
import { SalesCreate } from "@/components/master/sales/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sales Create - SA Marketing",
  description: "SA Marketing",
};


const SalesCreatePage = () => {
  return (<SalesCreate />)
};

export default SalesCreatePage;
