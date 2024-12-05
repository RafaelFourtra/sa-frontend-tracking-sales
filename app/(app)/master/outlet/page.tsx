import React from "react";
import { Outlet } from "@/components/master/outlet";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Outlet | SA Marketing",
  description: "SA Marketing",
};


const OutletPage = () => {
  return (<Outlet />)
};

export default OutletPage;
