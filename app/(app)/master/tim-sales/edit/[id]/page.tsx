import React from "react";
import { TimSalesEdit } from "@/components/master/tim-sales/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Tim Sales Edit - SA Marketing",
  description: "SA Marketing",
};


const TimSalesEditPage = () => {
  return (<TimSalesEdit />)
};

export default TimSalesEditPage;
