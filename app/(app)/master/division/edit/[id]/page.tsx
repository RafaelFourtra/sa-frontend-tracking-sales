import React from "react"
import type { Metadata } from "next";
import { DivisionEdit } from "@/components/master/division/edit";


export const metadata: Metadata = {
    title: "Division Edit | SA Marketing",
    description: "SA Marketing",
};

const DivisionEditPage = () => {
    return(<DivisionEdit />)
}

export default DivisionEditPage;