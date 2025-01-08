import React from "react";
import { UserEdit } from "@/components/master/user/edit";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "User Edit - SA Marketing",
  description: "SA Marketing",
};


const UserEditPage = () => {
  return (<UserEdit />)
};

export default UserEditPage;
