import React from "react";
import { AreaManagerEdit } from "@/components/master/area-manager/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Area Manager Edit - SA Marketing",
  description: "SA Marketing",
};


const AreaManagerEditPage = () => {
  return (<AreaManagerEdit />)
};

export default AreaManagerEditPage;
