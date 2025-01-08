import React from "react";
import { SpvEdit } from "@/components/master/spv/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Spv Edit - SA Marketing",
  description: "SA Marketing",
};


const SpvEditPage = () => {
  return (<SpvEdit />)
};

export default SpvEditPage;
