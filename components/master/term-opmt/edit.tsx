"use client";
import React, { ReactEventHandler } from "react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoIosArrowBack } from "react-icons/io";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import { Button, Card, CardBody, CardFooter, Input, Checkbox, Form } from "@nextui-org/react";
import Cookies from "js-cookie";


interface TermOpmt {
  DISCDAYS: number;
  DISCPC: number;
  NETDAYS: number; 
  TERMMEMO: string; 
  COD: boolean;
}

export const TermOpmtEdit = () => {
  const token = Cookies.get("auth_token");
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Syarat Pembayaran" },
    { label: "Edit" },
  ];

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TERM_OPMT_EDIT_URL_API}${id}`,
      { 
        cache: "no-store", 
        headers: {
        "Authorization": `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();

    if (result.status && result.message) {
      if (result.status == 200) {
        formik.setFieldValue('DISCDAYS', result.data.DISCDAYS);
        formik.setFieldValue('DISCPC', result.data.DISCPC);
        formik.setFieldValue('NETDAYS', result.data.NETDAYS);
        formik.setFieldValue('TERMMEMO', result.data.TERMMEMO);
        formik.setFieldValue('COD', result.data.COD);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const formik = useFormik<TermOpmt>({
    initialValues: {
      DISCDAYS: 0,
      DISCPC: 0,
      NETDAYS: 0,
      TERMMEMO: '',
      COD: false
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_TERM_OPMT_UPDATE_URL_API}${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(values),
            }
          );
          setIsLoading(true);
          const result = await response.json();
          if (result.status && result.message) {
            if (result.status == 200) {
              toast.success(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              formik.resetForm();
              setTimeout(async () => {
                setIsLoading(false);
                router.push("/master/term-opmt");
              }, 500);
            } else {
              toast.error(result.error[0].msg, {
                position: "top-right",
                autoClose: 2000,
                pauseOnHover: true,
                transition: Bounce,
              });
              setIsLoading(false);
            }
          } else {
            toast.error("Terjadi kesalahan pada sistem !", {
              position: "top-right",
              autoClose: 4000,
              pauseOnHover: true,
              transition: Bounce,
            });
            setIsLoading(false);
          }
        } catch (error: any) {
          toast.error(error.message, {
            position: "top-right",
            autoClose: 4000,
            pauseOnHover: true,
            transition: Bounce,
          });
          setIsLoading(false);
        }
      } else {
        toast.error("Koneksi gagal. Periksa jaringan Anda dan coba lagi.", {
          position: "top-right",
          autoClose: 4000,
          pauseOnHover: true,
          transition: Bounce,
        });
        setIsLoading(false);
      }
    },
  });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    formik.setFieldValue(name as keyof TermOpmt, value);
  };
  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer />
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">Edit Syarat Pembayaran</h3>
        <div className="flex flex-row items-center gap-2.5 flex-wrap">
          <Button
            size="md"
            className="flex items-center bg-[#FFDD00]"
            onClick={() => router.push("/master/term-opmt/")}
            startContent={<IoIosArrowBack className="text-lg" />}
          >
            <span className="pr-2 pb-[3px]">Back</span>
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <Card className="max-full p-3">
          <Form onSubmit={formik.handleSubmit}>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
              <Input
              autoFocus
              labelPlacement="outside"
              label="Jika membayar antara"
              type="number"
              radius="sm"
              name="DISCDAYS"
              value={formik.values.DISCDAYS}
              placeholder="Enter discon days"
              variant="bordered"
              endContent={
                "Hari"
              }
              onChange={handleChangeInput}
              isInvalid = {formik.errors.DISCDAYS ? true : false}
              errorMessage = {formik.errors.DISCDAYS ? formik.errors.DISCDAYS : ''}
          /> 
           <Input
              autoFocus
              labelPlacement="outside"
              label="Akan dapat diskon"
              type="number"
              radius="sm"
              name="DISCPC"
              value={formik.values.DISCPC}
              placeholder="Enter discon percentage"
              variant="bordered"
              endContent={
                "%"
              }
              onChange={handleChangeInput}
              isInvalid = {formik.errors.DISCPC ? true : false}
              errorMessage = {formik.errors.DISCPC ? formik.errors.DISCPC : ''}
          /> 
          <Input
              autoFocus
              labelPlacement="outside"
              label="Jatuh Tempo"
              type="number"
              radius="sm"
              name="NETDAYS"
              value={formik.values.NETDAYS}
              placeholder="Enter net days"
              variant="bordered"
              endContent={
                "Hari"
              }
              onChange={handleChangeInput}
              isInvalid = {formik.errors.NETDAYS ? true : false}
              errorMessage = {formik.errors.NETDAYS ? formik.errors.NETDAYS : ''}
          /> 
          <Input
              autoFocus
              labelPlacement="outside"
              label="Keterangan"
              radius="sm"
              name="TERMMEMO"
              value={formik.values.TERMMEMO}
              placeholder="Enter keterangan"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.TERMMEMO ? true : false}
              errorMessage = {formik.errors.TERMMEMO ? formik.errors.TERMMEMO : ''}
          /> 
          <div>
           <Checkbox 
            size="md" 
            className=""
            name="COD" 
            isSelected={formik.values.COD}
            checked={formik.values.COD}
            onChange={formik.handleChange}>
            Tunai Saat Pengantaran (C.O.D)
          </Checkbox>
          </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-end w-full">
                <Button
                  size="md"
                  color="primary"
                  className="mt-3 flex items-center"
                  type="submit"
                  isLoading={isLoading}
                >
                  <span>Submit</span>
                </Button>
              </div>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </div>
  );
};
