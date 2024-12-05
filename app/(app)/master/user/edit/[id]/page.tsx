import React from "react"
import type { Metadata } from "next";
import { UserEdit } from "@/components/master/user/edit";


export const metadata: Metadata = {
    title: "User Edit | SA Marketing",
    description: "SA Marketing",
};

const UserEditPage = () => {
    return(<UserEdit />)
}

export default UserEditPage;