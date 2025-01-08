import React from "react";
import { PermissionEdit } from "@/components/master/permission/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Permission Edit - SA Marketing",
  description: "SA Marketing",
};


const PermissionEditPage = () => {
  return (<PermissionEdit />)
};

export default PermissionEditPage;
