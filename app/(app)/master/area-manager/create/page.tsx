import React from "react";
import { AreaManagerCreate } from "@/components/master/area-manager/create";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Area Manager Create - SA Marketing",
  description: "SA Marketing",
};


const AreaManagerCreatePage = () => {
  return (<AreaManagerCreate />)
};

export default AreaManagerCreatePage;
