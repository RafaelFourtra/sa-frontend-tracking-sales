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
import { Button, Card, CardBody, CardFooter, Input, Checkbox, Form } from "@heroui/react";
import Cookies from "js-cookie";
import { useAuthorization } from "@/context/AuthorizationContext";
import ForbiddenError from "../../error/403";


interface SalesMan {
  SALESMANNO: string;
  FIRSTNAME: string;
  LASTNAME: string;
  PHONE: string;
  EMAIL: string;
  NOTES: string;
  SUSPENDED: boolean;
}

export const SalesManEdit = () => {
  const token = Cookies.get("auth_token");
  const [formData, setFormData] = useState<SalesMan>({
    SALESMANNO: "",
    FIRSTNAME: "",
    LASTNAME: "",
    PHONE: "",
    EMAIL: "",
    NOTES: "",
    SUSPENDED: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { userLogin, checkPermission } = useAuthorization()
  const [access, setAccess] = useState(null)

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Penjual" },
    { label: "Edit" },
  ];

  const router = useRouter();
  const params = useParams();
  const id = params.id;


  useEffect(() => {
    const fetchPermission = async () => {
      const permissionGranted = await checkPermission("penjual.update");
      setAccess(permissionGranted);
    }
    fetchPermission()

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SALESMAN_EDIT_URL_API}${id}`,
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
          setFormData(result.data);
        }
      }
    };
    fetchData();


  }, []);

  const validateSchema = Yup.object().shape({
    FIRSTNAME: Yup.string().required("Nama depan wajib diisi"),
    SALESMANNO: Yup.string().required("No penjual wajib diisi"),
  });

  const formik = useFormik<SalesMan>({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SALESMAN_UPDATE_URL_API}${id}`,
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
                router.push("/master/sales-man");
              }, 500);
            } else {
              toast.error(result.message, {
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
    const { name, type, value, checked } = e.target;

    setFormData((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
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
          <div className="flex justify-between flex-wrap gap-4 items-center">
            <h3 className="text-xl font-semibold">Edit Sales Man</h3>
            <div className="flex flex-row items-center gap-2.5 flex-wrap">
              <Button
                size="md"
                className="flex items-center bg-[#FFDD00]"
                onClick={() => router.push("/master/sales-man/")}
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
                      isRequired
                      labelPlacement="outside"
                      label="No. Penjual"
                      radius="sm"
                      name="SALESMANNO"
                      value={formData.SALESMANNO}
                      placeholder="Enter no penjual"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.SALESMANNO ? true : false}
                      errorMessage={formik.errors.SALESMANNO ? formik.errors.SALESMANNO : ''}
                    />
                    <Input
                      autoFocus
                      isRequired
                      labelPlacement="outside"
                      label="Nama Depan"
                      radius="sm"
                      name="FIRSTNAME"
                      value={formData.FIRSTNAME}
                      placeholder="Enter nama depan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.FIRSTNAME ? true : false}
                      errorMessage={formik.errors.FIRSTNAME ? formik.errors.FIRSTNAME : ''}
                    />
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Nama Belakang"
                      radius="sm"
                      name="LASTNAME"
                      value={formData.LASTNAME}
                      placeholder="Enter nama depan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.LASTNAME ? true : false}
                      errorMessage={formik.errors.LASTNAME ? formik.errors.LASTNAME : ''}
                    />
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Telepon"
                      radius="sm"
                      name="PHONE"
                      value={formData.PHONE}
                      placeholder="Enter telepon"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.PHONE ? true : false}
                      errorMessage={formik.errors.PHONE ? formik.errors.PHONE : ''}
                    />
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Email"
                      radius="sm"
                      name="EMAIL"
                      value={formData.EMAIL}
                      placeholder="Enter email"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.EMAIL ? true : false}
                      errorMessage={formik.errors.EMAIL ? formik.errors.EMAIL : ''}
                    />
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Notes"
                      radius="sm"
                      name="NOTES"
                      value={formData.NOTES}
                      placeholder="Enter notes"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.NOTES ? true : false}
                      errorMessage={formik.errors.NOTES ? formik.errors.NOTES : ''}
                    />
                    <div></div>
                    <div>
                      <Checkbox
                        size="md"
                        className="float-end"
                        name="SUSPENDED"
                        isSelected={formData.SUSPENDED}
                        checked={formData.SUSPENDED}
                        onChange={handleChangeInput}>
                        Non Aktif
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
