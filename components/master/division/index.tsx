"use client";
import { Button, Input } from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { TableWrapper } from "@/components/table/table";
import { IoSearch } from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";

export const Division = () => {
 
const [formValues, setFormValues] =  useState({})

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Master</BreadcrumbItem>
        <BreadcrumbItem>Division</BreadcrumbItem>
        <BreadcrumbItem>List</BreadcrumbItem>
      </Breadcrumbs>

      <h3 className="text-xl font-semibold">Filter</h3>
      <div className="flex flex-row gap-3.5 flex-wrap">
        <form>
        <Input
          type="text"
          labelPlacement="outside"
          label="Division"
          placeholder="Enter your division"
          className="max-w-[220px] drop-shadow-2xl border-solid border-[2px] border-[#cacace] rounded-md"
        />
        </form>
        <div className="flex flex-wrap mt-7">
          <Button
            size="sm"
            color="primary"
            className="p-3 min-w-0 flex items-center justify-center"
          >
            <IoSearch className="text-lg" />
          </Button>
          <Button
            size="sm"
            color="warning"
            className="ml-1 p-3 min-w-0 flex items-center justify-center"
          >
            <VscDebugRestart className="text-lg text-white" />
          </Button>
        </div>
      </div>
      <hr className="border-[#A1A1AA]"></hr>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">All Division</h3>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button size="md" color="primary">
            Add Division
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper />
      </div>
    </div>
  );
};
