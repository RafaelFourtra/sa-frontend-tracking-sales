import React from "react"
import type { Metadata } from "next";
import { OutletEdit } from "@/components/master/outlet/edit";


export const metadata: Metadata = {
    title: "Outlet Edit | SA Marketing",
    description: "SA Marketing",
};

const OutletEditPage = () => {
    return(<OutletEdit />)
}

export default OutletEditPage;