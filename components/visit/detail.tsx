"use client";
import {
  Button,
  Card,
  CardBody,
  Image,
  Modal,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { Breadcrumb } from "../breadcrumb/breadcrumb";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import { IoIosArrowBack } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useAuthorization } from "@/context/AuthorizationContext";
import ForbiddenError from "../error/403";
import OpenLayersMap from "../maps/map";



interface User {
  ID: number;
  NAME: string;
}

interface Pelanggan {
  ID: number;
  NAME: string;
}

interface Visit {
  ID: number;
  User: User;
  Pelanggan: Pelanggan;
  TANGGAL: string;
  CHECKIN: string;
  CHECKOUT: string;
  DIFFGPS_IN_PELANGGAN: string;
  DIFFGPS_IN_OUT: string;
  DURASI: string;
  IMAGE_IN_URL: string;
  IMAGE_OUT_URL: string;
  KETERANGAN: string;
  STATUS: string;
  CATATAN: string;
  LATITUDE_IN: string;
  LATITUDE_OUT: string;
  LONGITUDE_IN: string;
  LONGITUDE_OUT: string;
}

export const VisitDetail = () => {
  const router = useRouter();
  const token = Cookies.get("auth_token");
  const [isLoading, setIsLoading] = useState(true);
  const [visit, setVisit] = useState<Visit>(null);
  const { userLogin, checkPermission } = useAuthorization()
  const [access, setAccess] = useState(null)
  const [imageView, setImageView] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const params = useParams();
  const id = params.id;


  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_VISIT_SHOW_URL_API}${id}`,
          {
            cache: "no-store",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status == 200) {
          console.log("Response status:", result.data);

          setVisit(result.data || null);
        } else if (result.status == 403 || result.status == 401) {
          toast.error(result.message, {
            position: "top-right",
            autoClose: 4000,
            pauseOnHover: true,
            transition: Bounce,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setVisit(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPermission = async () => {
      const permissionGranted = await checkPermission("visit.detail");
      setAccess(permissionGranted);
    }
    fetchPermission()
    fetchDatas();
  }, []);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Visit" },
    { label: "Detail" },
  ];

  const viewImage = (image) => {
    setImageView(image)
    onOpen()
  }

  if (access === null) {
    return null;
  }

  if (!access) {
    return <ForbiddenError />;
  }
  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer />

      {/* <Divider /> */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">Detail Visit</h3>
        <div className="flex flex-row gap-3.5 flex-wrap">
            <Button
                size="md"
                className="flex items-center bg-[#FFDD00]"
                onPress={() => router.push("/visit")}
                startContent={<IoIosArrowBack className="text-lg" />}
              >
                <span className="pr-2 pb-[3px]">Back</span>
            </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <Card className="max-full">
          <CardBody>
            <div className="flex flex-row gap-5 flex-wrap">
              <div>
                {visit?.LATITUDE_IN && visit?.LONGITUDE_IN && ( 
                    <div>
                      <h3 className="mt-2 text-base font-medium">
                      Lokasi Check In:{" "}
                      </h3>
                      <OpenLayersMap 
                          longitude={isNaN(parseFloat(visit?.LONGITUDE_IN)) ? 0 : parseFloat(visit?.LONGITUDE_IN)} 
                          latitude={isNaN(parseFloat(visit?.LATITUDE_IN)) ? 0 : parseFloat(visit?.LATITUDE_IN)}  
                          zoom={17} 
                          height="160px" 
                          width="300px" />
                    </div>
                )}
                
                
                {visit?.LATITUDE_OUT && visit?.LONGITUDE_OUT && (
                  <div>
                    <h3 className="mt-2 text-base font-medium">
                      Lokasi Check Out:{" "}
                    </h3>
                    <OpenLayersMap 
                      longitude={isNaN(parseFloat(visit?.LONGITUDE_OUT)) ? 0 : parseFloat(visit?.LONGITUDE_OUT)} 
                      latitude={isNaN(parseFloat(visit?.LATITUDE_OUT)) ? 0 : parseFloat(visit?.LATITUDE_OUT)}  
                      zoom={17} 
                      height="160px" 
                      width="300px"  />
                  </div>
                )}
              </div>
              <div>
                {visit?.IMAGE_IN_URL && (
                  <>
                    <h3 className="mt-2 text-base font-medium">
                      Foto Check In:{" "}
                    </h3>
                    <Image
                        height={160}
                        className="object-cover"
                        src={`${visit?.IMAGE_IN_URL}?token=${token}`}
                        onClick={() => viewImage(`${visit?.IMAGE_IN_URL}?token=${token}`)}
                        width={260}
                      />
                  </>
                )} 
                {visit?.IMAGE_OUT_URL && (
                  <>
                    <h3 className="mt-2 text-base font-medium">
                      Foto Check Out:{" "}
                    </h3>
                    <Image
                        height={160}
                        className="object-cover"
                        src={`${visit?.IMAGE_OUT_URL}?token=${token}`}
                        onClick={() => viewImage(`${visit?.IMAGE_OUT_URL}?token=${token}`)}
                        width={260}
                      />
                  </>
                )}
              </div>
              <div className="p-2">
              <div className="grid grid-cols-2 gap-1">
                <h3 className="mt-4 text-base font-medium w-48 truncate">
                  Tanggal:{" "}
                  <span className="font-normal">{visit?.TANGGAL || "-"}</span>
                </h3>
                <h3 className="mt-4 text-base font-medium w-60">
                  Sales:{" "}
                  <span className="font-normal">
                    {visit?.User?.NAME || "-"}
                  </span>
                </h3> 
                <h3 className="mt-4 text-base font-medium w-60">
                  Pelanggan:{" "}
                  <span className="font-normal"> {visit?.Pelanggan?.NAME || "-"}</span>
                </h3>
                <h3 className="mt-4 text-base font-medium w-60">
                  Keterangan:{" "}
                  <span className="font-normal">
                    {visit?.KETERANGAN || "-"}
                  </span>
                </h3>
                <h3 className="mt-4 text-base font-medium w-60">
                  Check In:{" "}
                  <span className="font-normal">
                    {visit?.CHECKIN || "-"}
                  </span>
                </h3>
                <h3 className="mt-4 text-base font-medium w-60">
                  Check Out:{" "}
                  <span className="font-normal">
                    {visit?.CHECKOUT || "-"}
                  </span>
                </h3>
                <h3 className="mt-4 text-base font-medium w-60">
                  Durasi:{" "}
                  <span className="font-normal">
                    {visit?.DURASI || "-"}
                  </span>
                </h3>
                
                <h3 className="mt-4 text-base font-medium w-60">
                  Status:{" "}
                  <span className="font-normal">
                    {visit?.STATUS || "-"}
                  </span>
                </h3>
                
                <h3 className="mt-4 text-base font-medium">
                  Catatan:{" "}
                  <span className="font-normal">
                    {visit?.CATATAN || "-"}
                  </span>
                <h3></h3>
                <h3 className="mt-4 text-base font-medium">
                  Jarak Check In dengan Pelanggan:{" "}
                  <span className="font-normal">
                    {visit?.DIFFGPS_IN_PELANGGAN !== null && visit?.DIFFGPS_IN_PELANGGAN !== "" 
                      ? `${visit?.DIFFGPS_IN_PELANGGAN}` 
                      : "-"}
                  </span>
                </h3>
                <h3></h3>
                <h3 className="mt-4 text-base font-medium">
                  Jarak Check Out dengan Check In:{" "}
                  <span className="font-normal">
                    {visit?.DIFFGPS_IN_OUT != null ? `${visit.DIFFGPS_IN_OUT}` : "-"}
                  </span>
                </h3>
                </h3>
              </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modal isOpen={isOpen} size="md" onClose={onClose}>
        <ModalContent className="bg-transparent shadow-none">
          {/* {(onClose) => (
                <> */}
          {/* <ModalBody> */}
          <Image
            className="flex justify-center"
            src={imageView}
          />
          {/* </ModalBody> */}
          {/* </> */}
          {/* )} */}
        </ModalContent>
      </Modal>
    </div>
  );
};
