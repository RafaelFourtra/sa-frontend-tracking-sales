import React from "react";
import { AreaManager } from "@/components/master/area-manager";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Area Manager - SA Marketing",
  description: "SA Marketing",
};


const AreaManagerPage = () => {
  return (<AreaManager />)
};

export default AreaManagerPage;
