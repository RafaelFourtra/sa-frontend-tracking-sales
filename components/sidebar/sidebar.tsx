import React from "react";
import { Sidebar } from "./sidebar.styles";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { DivisionIcon } from "../icons/sidebar/division-icon";
import { PositionIcon } from "../icons/sidebar/position-icon";
import { UserIcon } from "../icons/sidebar/user-icon";
import { OutletIcon } from "../icons/sidebar/outlet-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <h3 className="font-semibold text-slate-100">SA MARKETING</h3>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Master">
              <SidebarItem
                isActive={pathname === "/master/division"}
                title="Division"
                icon={<DivisionIcon />}
                href="/master/division"
              />
              <SidebarItem
                isActive={pathname === "/master/position"}
                title="Position"
                icon={<PositionIcon />}
                href="/master/position"
              />
              <SidebarItem
                isActive={pathname === "/master/user"}
                title="User"
                icon={<UserIcon />}
                href="/master/user"
              />
              <SidebarItem
                isActive={pathname === "/master/outlet"}
                title="Outlet"
                icon={<OutletIcon />}
                href="/master/outlet"
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
