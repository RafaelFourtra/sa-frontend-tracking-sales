import React from "react"
import type { Metadata } from "next";
import { PositionEdit } from "@/components/master/position/edit";


export const metadata: Metadata = {
    title: "Position Edit | SA Marketing",
    description: "SA Marketing",
};

const PositionEditPage = () => {
    return(<PositionEdit />)
}

export default PositionEditPage;