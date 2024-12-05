import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";

interface BreadcrumbsCustomProps {
  items: { label: string }[];
}

export const Breadcrumb = ({ items }: BreadcrumbsCustomProps) => {
  return (
    <>
      <Breadcrumbs
        color="foreground"
        variant="solid"
        classNames={{
          list: "bg-[#ffdd00] shadow-small mt-7",
        }}
        itemClasses={{
          item: " data-[current=true]:black",
          separator: "text-black",
        }}
      >
        {items.map((item, index) => (
          <BreadcrumbItem>{item.label}</BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </>
  );
};
