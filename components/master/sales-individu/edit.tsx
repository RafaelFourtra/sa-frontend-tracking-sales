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
import { Button, Card, CardBody, CardFooter, Input, Form } from "@nextui-org/react";
import Select from 'react-select';
import Cookies from "js-cookie";


interface SalesIndividuData {
  NAME: string;
  SALESID: string;
  TIMSALESID: string;
  SPVID: string;
  AMID: string;
  RMID: string;
}

export const SalesIndividuEdit = () => {
  const token = Cookies.get("auth_token");
  const [isLoading, setIsLoading] = useState(false);
  const [regionalManager, setRegionalManager] = useState([]);
  const [areaManager, setAreaManager] = useState([]);
  const [spv, setSpv] = useState([]);
  const [timSales, setTimSales] = useState([]);
  const [sales, setSales] = useState([]);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Sales Individu" },
    { label: "Edit" },
  ];

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SALES_INDIVIDU_EDIT_URL_API}${id}`,
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
        formik.setFieldValue('SALESID', result.data.SALESID);
        formik.setFieldValue('TIMSALESID', result.data.TIMSALESID);
        formik.setFieldValue('SPVID', result.data.SPVID);
        formik.setFieldValue('AMID', result.data.AMID);
        formik.setFieldValue('RMID', result.data.RMID);
      }
    }

    // Regional Manager
    const responseDataRegionalManager = await fetch(
      `${process.env.NEXT_PUBLIC_REGIONAL_MANAGER_DATATABLE_URL_API}`,
      {
        cache: "no-store",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    )

    const dataRegionalManager = await responseDataRegionalManager.json()
    if (dataRegionalManager.status && dataRegionalManager.status == 200) {
      const formattedRegionalManager = dataRegionalManager.data.map((regionalManager: any) => ({
        label: regionalManager.NAME,
        value: regionalManager.ID
      }));
      setRegionalManager(formattedRegionalManager || [])
    }

    // Area Manager
    const responseDataAreaManager = await fetch(
      `${process.env.NEXT_PUBLIC_AREA_MANAGER_DATATABLE_URL_API}`,
      {
        cache: "no-store",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    )

    const dataAreaManager = await responseDataAreaManager.json()
    if (dataAreaManager.status && dataAreaManager.status == 200) {
      const formattedAreaManager = dataAreaManager.data.map((areaManager: any) => ({
        label: areaManager.NAME,
        value: areaManager.ID
      }));
      setAreaManager(formattedAreaManager || [])
    }

    // Spv
    const responseDataSpv = await fetch(
      `${process.env.NEXT_PUBLIC_SPV_DATATABLE_URL_API}`,
      {
        cache: "no-store",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    )

    const dataSpv = await responseDataSpv.json()
    if (dataSpv.status && dataSpv.status == 200) {
      const formattedSpv = dataSpv.data.map((spv: any) => ({
        label: spv.NAME,
        value: spv.ID
      }));
      setSpv(formattedSpv || [])
    }

    // Tim Sales
    const responseDataTimSales = await fetch(
      `${process.env.NEXT_PUBLIC_TIMSALES_DATATABLE_URL_API}`,
      {
        cache: "no-store",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    )

    const dataTimSales = await responseDataTimSales.json()
    if (dataTimSales.status && dataTimSales.status == 200) {
      const formattedTimSales = dataTimSales.data.map((timsales: any) => ({
        label: timsales.NAME,
        value: timsales.ID
      }));
      setTimSales(formattedTimSales || [])
    }

    // Sales
    const responseDataSales = await fetch(
      `${process.env.NEXT_PUBLIC_SALES_DATATABLE_URL_API}`,
      {
        cache: "no-store",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    )

    const dataSales = await responseDataSales.json()
    if (dataSales.status && dataSales.status == 200) {
      const formattedSales = dataSales.data.map((sales: any) => ({
        label: sales.NAME,
        value: sales.ID
      }));
      setSales(formattedSales || [])
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateSchema = Yup.object().shape({
    NAME: Yup.string().required("Sales individu wajib diisi"),
    SALESID: Yup.string().required("Sales wajib diisi"),
    TIMSALESID: Yup.string().required("Sales wajib diisi"),
    SPVID: Yup.string().required("Spv wajib diisi"),
    AMID: Yup.string().required("Area manager wajib diisi"),
    RMID: Yup.string().required("Regional manager wajib diisi"),
  });

  const formik = useFormik<SalesIndividu>({
    initialValues: {
      NAME: "",
      SALESID: "",
      TIMSALESID: "",
      SPVID: "",
      AMID: "",
      RMID: "",
    },
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SALES_INDIVIDU_UPDATE_URL_API}${id}`,
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
                router.push("/master/sales-individu");
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
    const { name, value } = e.target;
    formik.setFieldValue(name as keyof SalesIndividu, value);
  };

  const handleSelectChange = (selectedOption, { name }) => {
    const value = selectedOption ? selectedOption.value : '';

    formik.setFieldValue(name, value);
  }

  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer />
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">Edit Sales Individu</h3>
        <div className="flex flex-row items-center gap-2.5 flex-wrap">
          <Button
            size="md"
            className="flex items-center bg-[#FFDD00]"
            onClick={() => router.push("/master/sales-individu/")}
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
                  <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.SALESID ? 'text-[#F31260]' : ''}`}>Sales <span className="text-red-500">*</span></h3>
                  <Select
                    className={`text-sm basic-single mt-2 ${formik.errors.SALESID ? 'is-invalid' : ''}`}
                    classNamePrefix="select"
                    placeholder="Select a sales"
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    name="SALESID"
                    options={sales}
                    value={sales.find(option => option.value === formik.values.SALESID) || null}
                    onChange={(selectedOption, actionMeta) =>
                      handleSelectChange(selectedOption, actionMeta, false)
                    }
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        backgroundColor: 'transparent',
                        borderWidth: formik.errors.SALESID ? '2px' : '1px',
                        borderColor: formik.errors.SALESID
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
                    menuPortalTarget={document.body}
                  />
                  {formik.errors.SALESID && (
                    <span className="text-[#F31260] text-xs ml-1">{formik.errors.SALESID}</span>
                  )}
                </div>
                <div>
                  <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.TIMSALESID ? 'text-[#F31260]' : ''}`}>Tim Sales <span className="text-red-500">*</span></h3>
                  <Select
                    className={`text-sm basic-single mt-2 ${formik.errors.TIMSALESID ? 'is-invalid' : ''}`}
                    classNamePrefix="select"
                    placeholder="Select a sales"
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    name="TIMSALESID"
                    options={timSales}
                    value={timSales.find(option => option.value === formik.values.TIMSALESID) || null}
                    onChange={(selectedOption, actionMeta) =>
                      handleSelectChange(selectedOption, actionMeta, false)
                    }
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        backgroundColor: 'transparent',
                        borderWidth: formik.errors.TIMSALESID ? '2px' : '1px',
                        borderColor: formik.errors.TIMSALESID
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
                    menuPortalTarget={document.body}
                  />
                  {formik.errors.TIMSALESID && (
                    <span className="text-[#F31260] text-xs ml-1">{formik.errors.TIMSALESID}</span>
                  )}
                </div>
                <div>
                  <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.SPVID ? 'text-[#F31260]' : ''}`}>Spv <span className="text-red-500">*</span></h3>
                  <Select
                    className={`text-sm basic-single mt-2 ${formik.errors.SPVID ? 'is-invalid' : ''}`}
                    classNamePrefix="select"
                    placeholder="Select a sales"
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    name="SPVID"
                    options={spv}
                    value={spv.find(option => option.value === formik.values.SPVID) || null}
                    onChange={(selectedOption, actionMeta) =>
                      handleSelectChange(selectedOption, actionMeta, false)
                    }
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        backgroundColor: 'transparent',
                        borderWidth: formik.errors.SPVID ? '2px' : '1px',
                        borderColor: formik.errors.SPVID
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
                    menuPortalTarget={document.body}
                  />
                  {formik.errors.SPVID && (
                    <span className="text-[#F31260] text-xs ml-1">{formik.errors.SPVID}</span>
                  )}
                </div>
                <div>
                  <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.AMID ? 'text-[#F31260]' : ''}`}>Area Manager <span className="text-red-500">*</span></h3>
                  <Select
                    className={`text-sm basic-single mt-2 ${formik.errors.AMID ? 'is-invalid' : ''}`}
                    classNamePrefix="select"
                    placeholder="Select a sales"
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    name="AMID"
                    options={areaManager}
                    value={areaManager.find(option => option.value === formik.values.AMID) || null}
                    onChange={(selectedOption, actionMeta) =>
                      handleSelectChange(selectedOption, actionMeta, false)
                    }
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        backgroundColor: 'transparent',
                        borderWidth: formik.errors.AMID ? '2px' : '1px',
                        borderColor: formik.errors.AMID
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
                    menuPortalTarget={document.body}
                  />
                  {formik.errors.AMID && (
                    <span className="text-[#F31260] text-xs ml-1">{formik.errors.AMID}</span>
                  )}
                </div>
                <div>
                  <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.RMID ? 'text-[#F31260]' : ''}`}>Regional Manager <span className="text-red-500">*</span></h3>
                  <Select
                    className={`text-sm basic-single mt-2 ${formik.errors.RMID ? 'is-invalid' : ''}`}
                    classNamePrefix="select"
                    placeholder="Select a sales"
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    name="RMID"
                    options={regionalManager}
                    value={regionalManager.find(option => option.value === formik.values.RMID) || null}
                    onChange={(selectedOption, actionMeta) =>
                      handleSelectChange(selectedOption, actionMeta, false)
                    }
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        backgroundColor: 'transparent',
                        borderWidth: formik.errors.RMID ? '2px' : '1px',
                        borderColor: formik.errors.RMID
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
                    menuPortalTarget={document.body}
                  />
                  {formik.errors.RMID && (
                    <span className="text-[#F31260] text-xs ml-1">{formik.errors.RMID}</span>
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
