import React from "react";
import { Sidebar } from "./sidebar.styles";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { DivisionIcon } from "../icons/sidebar/division-icon";
import { PositionIcon } from "../icons/sidebar/position-icon";
import { DaftarLainIcon } from "../icons/sidebar/daftar-lain-icon";
import { UserIcon } from "../icons/sidebar/user-icon";
import { OutletIcon } from "../icons/sidebar/outlet-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { CollapseItems } from './collapse-items';
import { BalanceIcon } from '../icons/sidebar/balance-icon';
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";
import { ScrollShadow, Image } from "@heroui/react";
import { VisitIcon } from "../icons/sidebar/visit-icon";
import { VisitJumlahIcon } from "../icons/sidebar/visit-jumlah-icon";



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
          <Image
            className="mr-3"
            src="/logo.png"
            width={140}
          />
          {/* <h3 className="font-bold text-[#ffb400] text-lg">SA MARKETING</h3> */}
        </div>

        {/* ScrollShadow to make sidebar scrollable */}
        <ScrollShadow hideScrollBar className="flex flex-col justify-between h-full overflow-auto">
          <div className={Sidebar.Body()}>
            <SidebarMenu title="Home">
              <SidebarItem
                title="Home"
                icon={<HomeIcon />}
                isActive={pathname === "/home"}
                href="/home"
              />
            </SidebarMenu>
            <SidebarMenu title="Visit">
              <SidebarItem
                isActive={pathname.startsWith("/visit") && pathname != "/visit/jumlah"}
                title="Visit"
                icon={<VisitIcon />}
                href="/visit"
              />
              <SidebarItem
                isActive={pathname === "/visit/jumlah"}
                title="Jumlah Per Sales"
                icon={<VisitJumlahIcon />}
                href="/visit/jumlah"
              />
            </SidebarMenu>

            <SidebarMenu title="Master">
              <SidebarItem
                isActive={pathname.startsWith("/master/pelanggan")}
                title="Pelanggan"
                icon={<OutletIcon />}
                href="/master/pelanggan"
              />
              <CollapseItems
                icon={<PositionIcon />}
                items={[
                  { label: "Sales Individu", href: "/master/sales-individu" },
                  { label: "Sales", href: "/master/sales" },
                  { label: "Tim Sales", href: "/master/tim-sales" },
                  { label: "SPV", href: "/master/spv" },
                  { label: "Manager Wilayah", href: "/master/area-manager" },
                  { label: "Manager Regional", href: "/master/regional-manager" },
                ]}
                title="Struktur"
              />
              <CollapseItems
                icon={<DaftarLainIcon />}
                items={[
                  { label: "Penjual", href: "/master/sales-man" },
                  { label: "Syarat Pembayaran", href: "/master/term-opmt" },
                  { label: "User", href: "/master/user" },
                  { label: "Permission", href: "/master/permission" },
                ]}
                title="Daftar Lain"
              />
            </SidebarMenu>
          </div>
        </ScrollShadow>
      </div>
    </aside>
  );
};
