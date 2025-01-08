import React from "react";
import { TimSalesCreate } from "@/components/master/tim-sales/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Tim Sales Create - SA Marketing",
  description: "SA Marketing",
};


const TimSalesCreatePage = () => {
  return (<TimSalesCreate />)
};

export default TimSalesCreatePage;
