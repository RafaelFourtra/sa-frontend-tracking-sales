import React from "react";
import { TimSales } from "@/components/master/tim-sales";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Tim Sales - SA Marketing",
  description: "SA Marketing",
};


const TimSalesPage = () => {
  return (<TimSales />)
};

export default TimSalesPage;
