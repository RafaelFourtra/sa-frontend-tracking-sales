import React from "react";
import { Position } from "@/components/master/position";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Position | SA Marketing",
  description: "SA Marketing",
};


const PositionPage = () => {
  return (<Position />)
};

export default PositionPage;
