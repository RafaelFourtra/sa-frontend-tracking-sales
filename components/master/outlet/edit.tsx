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
import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react";
import Select from 'react-select';

interface OutletData {
    codeOutlet: string;
    outlet: string;
    cityId: string;
    address: string;
    area: string;
    userManagerId: string;
    pjSales: any;
    longitude?: string; 
    latitude?: string; 
}

export const OutletEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [city, setCity] = useState([]);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Outlet" },
    { label: "Edit" },
  ];

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const fetchData = async () => {
    const responseMasterUser = await fetch(
        `${process.env.NEXT_PUBLIC_USER_DATATABLE_URL_API}`
      )

      const dataMasterUser = await responseMasterUser.json()
      const formattedUsers = dataMasterUser.data.map((user :any) => ({
        label: user.name,  
        value: user.id    
      }));
      setUser(formattedUsers || [])

      const responseMasterCity = await fetch(
        `${process.env.NEXT_PUBLIC_CITY_MASTER_URL_API}`
      )

    const dataMasterCity = await responseMasterCity.json()
      const formattedCities = dataMasterCity.data.map((city :any) => ({
        label: city.city,  
        value: city.id    
      }));

      setCity(formattedCities)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OUTLET_EDIT_URL_API}${id}`,
      { cache: "no-store" }
    );
    const result = await response.json();

    console.log(result)
    if (result.status && result.message) {
      if (result.status == 200) {
        const pjSalesGet = result.data.outletDetail.map((ps :any) => ps.pjSalesId)

        formik.setFieldValue('codeOutlet', result.data.codeOutlet);
        formik.setFieldValue('outlet', result.data.outlet);
        formik.setFieldValue('cityId', result.data.cityId);
        formik.setFieldValue('address', result.data.address);
        formik.setFieldValue('area', result.data.area);
        formik.setFieldValue('userManagerId', result.data.userManagerId);
        formik.setFieldValue('pjSales', pjSalesGet);
        formik.setFieldValue('longitude', result.data.longitude); 
        formik.setFieldValue('latitude', result.data.latitude);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateSchema = Yup.object().shape({
    codeOutlet : Yup.string().required("Outlet code wajib diisi"),
    outlet : Yup.string().required("Outlet wajib diisi"),
    cityId : Yup.string().required("City wajib diisi"),
    address : Yup.string().required("Address wajib diisi"),
    area : Yup.string().required("Area wajib diisi"),
    userManagerId : Yup.string().required("Manager wajib diisi"),
    pjSales: Yup.array().min(1, "PJ Sales wajib diisi").required("PJ Sales wajib diisi"),
  });

  const formik = useFormik<OutletData>({
    initialValues:{
      codeOutlet : "",
      outlet : "",
      cityId : "",
      address : "",
      area : "",
      userManagerId : "",
      pjSales : "",
      longitude: "",
      latitude: "",
    },
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_OUTLET_UPDATE_URL_API}${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
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
                router.push("/master/outlet");
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

  const handleChangeInput= (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    formik.setFieldValue(name as keyof OutletData, value);
  }


  const handleSelectChange = (selectedOption, { name }, isMulti) => {
    const value = isMulti
      ? Array.isArray(selectedOption)
        ? selectedOption.map(option => option.value)
        : [] 
      : selectedOption ? selectedOption.value : ''; 
  
    formik.setFieldValue(name, value);
  };
  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer />
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">Edit Outlet</h3>
        <div className="flex flex-row items-center gap-2.5 flex-wrap">
          <Button
            size="md"
            className="flex items-center bg-[#FFDD00]"
            onClick={() => router.push("/master/outlet/")}
            startContent={<IoIosArrowBack className="text-lg" />}
          >
            <span className="pr-2 pb-[3px]">Back</span>
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <Card className="max-full p-3">
        <form onSubmit={formik.handleSubmit}>
        <CardBody>
          <div className="grid grid-cols-2 gap-4">
            <Input
              autoFocus
              isRequired
              labelPlacement="outside"
              label="Outlet Code"
              radius="sm"
              name="codeOutlet"
              value={formik.values.codeOutlet}
              placeholder="Enter outlet code"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.codeOutlet ? true : false}
              errorMessage = {formik.errors.codeOutlet ? formik.errors.codeOutlet : ''}
          /> 
           <Input
              autoFocus
              isRequired
              labelPlacement="outside"
              label="Outlet"
              radius="sm"
              name="outlet"
              value={formik.values.outlet}
              placeholder="Enter outlet"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.outlet ? true : false}
              errorMessage = {formik.errors.outlet ? formik.errors.outlet : ''}
          /> 
            <div>
                <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.cityId ? 'text-[#F31260]' : ''}`}>City <span className="text-red-500">*</span></h3>
               <Select
                  className={`basic-single mt-2 ${formik.errors.cityId ? 'is-invalid' : ''}`}
                  classNamePrefix="select"
                  placeholder="Select a city"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="cityId"
                  options={city}
                  value={city.find(option => option.value === formik.values.cityId) || null} 
                  onChange={(selectedOption, actionMeta) =>
                    handleSelectChange(selectedOption, actionMeta, false) 
                  }                  
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderWidth: formik.errors.cityId ? '2px' : '1px',  
                      borderColor: formik.errors.cityId
                      ? '#F31260' 
                      : 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      maxWidth: '581px',
                      zIndex: 1000
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      zIndex: 1050,
                    }),
                    menuPortal: (base :any) => ({
                      ...base,
                      zIndex: 1050,
                    }),
                    placeholder: (base :any) => ({
                      ...base,
                      fontSize: '0.875rem', 
                      lineHeight: '1.25rem',
                      color: '#6b6b72',  
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
                 {formik.errors.cityId && (
                    <span className="text-[#F31260] text-xs ml-1">{formik.errors.cityId}</span>
                  )}
              </div>
            <Input
              autoFocus
              isRequired
              labelPlacement="outside"
              label="Address"
              radius="sm"
              name="address"
              value={formik.values.address}
              placeholder="Enter address"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.address ? true : false}
              errorMessage = {formik.errors.address ? formik.errors.address : ''}
          /> 
             <Input
              autoFocus
              isRequired
              labelPlacement="outside"
              label="Area"
              radius="sm"
              name="area"
              value={formik.values.area}
              placeholder="Enter area"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.area ? true : false}
              errorMessage = {formik.errors.area ? formik.errors.area : ''}
          /> 
            <div>
              <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.userManagerId ? 'text-[#F31260]' : ''}`}>Manager <span className="text-red-500">*</span></h3>
               <Select
                  className={`basic-single mt-[7px] ${formik.errors.userManagerId ? 'is-invalid' : ''}`}
                  classNamePrefix="select"
                  placeholder="Select a manager outlet"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="userManagerId"
                  value={user.find(option => option.value === formik.values.userManagerId) || null} 
                  options={user}
                  onChange={(selectedOption, actionMeta) =>
                    handleSelectChange(selectedOption, actionMeta, false) 
                  }
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderWidth: formik.errors.userManagerId ? '2px' : '1px',  
                      borderColor: formik.errors.userManagerId
                      ? '#F31260' 
                      : 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      maxWidth: '581px',
                      zIndex: 1000
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      zIndex: 1050,
                    }),
                    menuPortal: (base :any) => ({
                      ...base,
                      zIndex: 1050,
                    }),
                    placeholder: (base :any) => ({
                      ...base,
                      fontSize: '0.875rem', 
                      lineHeight: '1.25rem',
                      color: '#6b6b72',  
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
                  {formik.errors.userManagerId && (
                    <span className="text-[#F31260] text-xs ml-1">{formik.errors.userManagerId}</span>
                  )}
              </div>
              <div>
                <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.pjSales ? 'text-[#F31260]' : ''}`}>PJ Sales <span className="text-red-500">*</span></h3>
               <Select
                  className="basic-multi-select mt-2"
                  classNamePrefix="select"
                  placeholder="Select a pj sales"
                  isDisabled={false}
                  isLoading={false} 
                  isMulti={true}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="pjSales"
                  value={
                    Array.isArray(formik.values.pjSales)
                      ? formik.values.pjSales.map(value => user.find(option => option.value === value))
                      : user.find(option => option.value === formik.values.pjSales) || null
                  }
                  options={user}
                  onChange={(selectedOption, actionMeta) =>
                    handleSelectChange(selectedOption, actionMeta, true) 
                  }                  
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderWidth: formik.errors.userManagerId ? '2px' : '1px',  
                      borderColor: formik.errors.userManagerId
                      ? '#F31260' 
                      : 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      maxWidth: '581px',
                      zIndex: 1000
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      zIndex: 1050,
                    }),
                    menuPortal: (base :any) => ({
                      ...base,
                      zIndex: 1050,
                    }),
                    placeholder: (base :any) => ({
                      ...base,
                      fontSize: '0.875rem', 
                      lineHeight: '1.25rem',
                      color: '#6b6b72',  
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
                 {formik.errors.pjSales && (
                    <span className="text-[#F31260] text-xs ml-1">{formik.errors.pjSales}</span>
                  )}
              </div>
           <Input
              autoFocus
              labelPlacement="outside"
              label="Longitude"
              radius="sm"
              name="longitude"
              value={formik.values.longitude}
              placeholder="Enter longitude"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.longitude ? true : false}
              errorMessage = {formik.errors.longitude ? formik.errors.longitude : ''}
          /> 
          <Input
              autoFocus
              labelPlacement="outside"
              label="Latitude"
              radius="sm"
              name="latitude"
              value={formik.values.latitude}
              placeholder="Enter latitude"
              variant="bordered"
              onChange={handleChangeInput}
              isInvalid = {formik.errors.latitude ? true : false}
              errorMessage = {formik.errors.latitude ? formik.errors.latitude : ''}
          /> 
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
        </form>
        </Card>
      </div>
    </div>
  );
};
