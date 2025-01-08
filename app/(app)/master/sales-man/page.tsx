import React from "react";
import { SalesMan } from "@/components/master/sales-man";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sales Man - SA Marketing",
  description: "SA Marketing",
};


const SalesManPage = () => {
  return (<SalesMan />)
};

export default SalesManPage;
