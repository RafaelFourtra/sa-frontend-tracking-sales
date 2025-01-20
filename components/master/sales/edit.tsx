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
import { Button, Card, CardBody, CardFooter, Input, Form } from "@heroui/react";
import Select from 'react-select';
import Cookies from "js-cookie";
import { useAuthorization } from "@/context/AuthorizationContext";
import ForbiddenError from "../../error/403";

interface Sales {
  NAME: string;
  SALESMANID: string;
}

export const SalesEdit = () => {
  const token = Cookies.get("auth_token");
  const [isLoading, setIsLoading] = useState(false);
  const [salesMan, setSalesMan] = useState([]);
  const { userLogin, checkPermission } = useAuthorization()
  const [access, setAccess] = useState(null)

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Sales" },
    { label: "Edit" },
  ];

  useEffect(() => {
    const fetchPermission = async () => {
      const permissionGranted = await checkPermission("sales.update");
      setAccess(permissionGranted);
    }
    fetchPermission()

  }, []);

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const validateSchema = Yup.object().shape({
    NAME: Yup.string().required("Sales wajib diisi"),
    SALESMANID: Yup.string().required("Penjual wajib diisi"),
  });

  const formik = useFormik<Sales>({
    initialValues: {
      NAME: "",
      SALESMANID: "",
    },
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SALES_UPDATE_URL_API}${id}`,
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
                router.push("/master/sales");
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SALES_EDIT_URL_API}${id}`,
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
          formik.setFieldValue('NAME', result.data.NAME);
          formik.setFieldValue('SALESMANID', result.data.SALESMANID);
        }
      }

      const responseDataSalesman = await fetch(
        `${process.env.NEXT_PUBLIC_SALESMAN_DATATABLE_URL_API}`,
        {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      )

      const dataSalesMan = await responseDataSalesman.json()
      if (dataSalesMan.status && dataSalesMan.status == 200) {
        const formattedSalesman = dataSalesMan.data.map((salesman: any) => ({
          label: salesman.SALESMANNAME,
          value: salesman.SALESMANID
        }));
        setSalesMan(formattedSalesman || [])
      }
    };
    fetchData();

  }, []);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    formik.setFieldValue(name as keyof Sales, value);
  };

  const handleSelectChange = (selectedOption, { name }) => {
    const value = selectedOption ? selectedOption.value : '';

    formik.setFieldValue(name, value);
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
          <div className="flex justify-between flex-wrap gap-4 items-center">
            <h3 className="text-xl font-semibold">Edit Sales</h3>
            <div className="flex flex-row items-center gap-2.5 flex-wrap">
              <Button
                size="md"
                className="flex items-center bg-[#FFDD00]"
                onClick={() => router.push("/master/sales/")}
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
                      label="Sales"
                      radius="sm"
                      name="NAME"
                      value={formik.values.NAME}
                      placeholder="Enter sales"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid={formik.errors.NAME ? true : false}
                      errorMessage={
                        formik.errors.NAME ? formik.errors.NAME : ""
                      }
                    />
                    <div>
                      <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.SALESMANID ? 'text-[#F31260]' : ''}`}>Penjual <span className="text-red-500">*</span></h3>
                      <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.SALESMANID ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a penjual"
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="SALESMANID"
                        options={salesMan}
                        value={salesMan.find(option => option.value === formik.values.SALESMANID) || null}
                        onChange={handleSelectChange}
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            backgroundColor: 'transparent',
                            borderWidth: formik.errors.SALESMANID ? '2px' : '1px',
                            borderColor: formik.errors.SALESMANID
                              ? '#F31260'
                              : 'rgba(0, 0, 0, 0.12)',
                            borderRadius: '8px',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            maxWidth: '581px',
                            zIndex: 1000
                          }),
                          menu: (base: any) => ({
                            ...base,
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            zIndex: 1050,
                          }),
                          menuPortal: (base: any) => ({
                            ...base,
                            zIndex: 1050,
                            fontSize: '0.875rem'
                          }),
                          placeholder: (base: any) => ({
                            ...base,
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            color: '#6b6b72',
                          }),
                        }}
                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                      />
                      {formik.errors.SALESMANID && (
                        <span className="text-[#F31260] text-xs ml-1">{formik.errors.SALESMANID}</span>
                      )}
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
