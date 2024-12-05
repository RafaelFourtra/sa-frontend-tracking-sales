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
import { Button, Card, CardBody, CardFooter, Input, DatePicker, Select as NextSelect, SelectItem, Image } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useDropzone } from 'react-dropzone'
import Select from 'react-select';


export const UserEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filesPreview, setFilesPreview] = useState([]);
  const [optionsDivision, setOptionsDivision]  = useState([]); 
  const [optionsPosition, setOptionsPosition]  = useState([]); 
  const [user, setUser] = useState([]);


  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "User" },
    { label: "Edit" },
  ];

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_EDIT_URL_API}${id}`,
      { cache: "no-store" }
    );
    const result = await response.json();

    const responseMasterUser = await fetch(
      `${process.env.NEXT_PUBLIC_USER_DATATABLE_URL_API}`
    )

    const dataMasterUser = await responseMasterUser.json()
    console.log(dataMasterUser)
    const formattedUsers = dataMasterUser.data.map((user :any) => ({
      label: user.name,  
      value: user.id    
    }));
    setUser(formattedUsers || [])

    const responseMasterDivision = await fetch(
      `${process.env.NEXT_PUBLIC_DIVISION_DATATABLE_URL_API}`
    )

    const dataMasterDivision = await responseMasterDivision.json()
    setOptionsDivision(dataMasterDivision.data || [])

    const responseMasterPosition = await fetch(
      `${process.env.NEXT_PUBLIC_POSITION_DATATABLE_URL_API}`
    )

    const dataMasterPosition = await responseMasterPosition.json()
    setOptionsPosition(dataMasterPosition.data || [])

    if (result.status && result.message) {
      if (result.status == 200) {
        const supervisor = [result.data.supervisor1Id, result.data.supervisor2Id];
        formik.setFieldValue('nik', result.data.nik);
        formik.setFieldValue('name', result.data.name);
        formik.setFieldValue('email', result.data.email);
        formik.setFieldValue('password', result.data.password);
        formik.setFieldValue('phone', result.data.phone);
        formik.setFieldValue('dateJoin', result.data.dateJoin);
        formik.setFieldValue('divisionId', result.data.divisionId);
        formik.setFieldValue('positionId', result.data.positionId); 
        formik.setFieldValue('role', result.data.role);
        formik.setFieldValue('supervisor', supervisor);
        formik.setFieldValue('manager', result.data.managerId);
        formik.setFieldValue('imageProfile', result.data.imageProfile);

        console.log(supervisor)
        if (result.data?.imageProfile) {
          const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_API}/uploads/user-profile/${result.data.imageProfile}`;
          const imageName = result.data.imageProfile.split('/').pop();  

          setFilesPreview([{ preview: imageUrl, name: imageName }]);
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFilesPreview(acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ));
    }
  });

  useEffect(() => {
    return () => {
      filesPreview.forEach((file) => {
        if (file.preview && file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [filesPreview]);

  const imagePreview = filesPreview.map((file) => (
    <Image
      key={file.name}
      className="bg-auto"
      width={300}
      height={200}
      alt={`Preview of ${file.name}`}
      src={file.preview}
    />
  ));

  const validateSchema = Yup.object().shape({
    nik: Yup.string()
    .required("NIK wajib diisi")
    .length(16, "NIK harus 16 digit"),
    name: Yup.string()
    .trim()                           
    .required("Nama wajib diisi"),
    email: Yup.string()
    .email("Format email tidak valid")  
    .required("Email wajib diisi"),
    phone: Yup.string()
    .matches(/^\d+$/, "Phone harus berupa angka")
    .required("Phone wajib diisi"),
    dateJoin: Yup.date()
    .typeError("Format Date Join tidak valid")  
    .required("Date Join wajib diisi"),
    divisionId : Yup.string().required("Division wajib diisi"),
    positionId : Yup.string().required("Position wajib diisi"),
    role: Yup.string().required("Role wajib diisi"),
  });

  const formik = useFormik({
    initialValues: {
      nik: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      dateJoin: '',
      divisionId: '',
      positionId: '',
      role: '',
      imageProfile: '',
      supervisor: '',
      manager: ''
    },
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          console.log(values)
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_USER_UPDATE_URL_API}${id}`,
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
              setSelectedDate(null)
              setFilesPreview([])
              setTimeout(async () => {
                setIsLoading(false);
                router.push("/master/user");
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

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    formik.setFieldValue(name, value);
  }

  const handleSelectChange = (selectedOption, { name }, isMulti) => {
    const value = isMulti
      ? Array.isArray(selectedOption)
        ? selectedOption.map(option => option.value)
        : [] 
      : selectedOption ? selectedOption.value : ''; 
  
    formik.setFieldValue(name, value);
  }

  useEffect(() => {
    const dateJoin = formik.values.dateJoin;
    if (dateJoin) {
      const formattedDateString = dateJoin.split('T')[0];
      const initialParsedDate = parseDate(formattedDateString);
      setSelectedDate(initialParsedDate);
    }
  }, [formik.values.dateJoin]);
  
    return (
      <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
        <Breadcrumb items={breadcrumbItems} />
        <ToastContainer />
        <div className="flex justify-between flex-wrap gap-4 items-center">
          <h3 className="text-xl font-semibold">Edit User</h3>
          <div className="flex flex-row items-center gap-2.5 flex-wrap">
            <Button
              size="md"
              className="flex items-center bg-[#FFDD00]"
              onClick={() => router.push("/master/user/")}
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
                label="NIK"
                type="number"
                radius="sm"
                name="nik"
                value={formik.values.nik}
                placeholder="Enter your nik"
                variant="bordered"
                onChange={handleChangeInput}
                isInvalid = {formik.errors.nik ? true : false}
                errorMessage = {formik.errors.nik ? formik.errors.nik : ''}
              /> 
             <Input
                autoFocus
                isRequired
                labelPlacement="outside"
                label="Name"
                radius="sm"
                name="name"
                value={formik.values.name}
                placeholder="Enter your name"
                variant="bordered"
                onChange={handleChangeInput}
                isInvalid = {formik.errors.name ? true : false}
                errorMessage = {formik.errors.name ? formik.errors.name : ''}
            /> 
             <Input
                autoFocus
                isRequired
                labelPlacement="outside"
                label="Email"
                type="email"
                radius="sm"
                name="email"
                value={formik.values.email}
                placeholder="Enter your email"
                variant="bordered"
                onChange={handleChangeInput}
                isInvalid = {formik.errors.email ? true : false}
                errorMessage = {formik.errors.email ? formik.errors.email : ''}
            /> 
                <Input
                autoFocus
                isRequired
                labelPlacement="outside"
                label="Phone"
                radius="sm"
                type="number"
                name="phone"
                value={formik.values.phone}
                placeholder="Enter your phone"
                variant="bordered"
                onChange={handleChangeInput}
                isInvalid = {formik.errors.phone ? true : false}
                errorMessage = {formik.errors.phone ? formik.errors.phone : ''}
            /> 
              <DatePicker 
                  isRequired
                  name="dateJoin"
                  label={"Date Join"}
                  variant="bordered"
                  labelPlacement="outside"
                  value={selectedDate}
                  onChange={(value) => {
                    if (value) {
                      const { year, month, day } = value;
                      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      formik.setFieldValue("dateJoin", formattedDate);
                    }
                  }}
                  isInvalid = {formik.errors.dateJoin ? true : false}
                  errorMessage = {formik.errors.dateJoin ? formik.errors.dateJoin : ''}
                />
                <NextSelect
                isRequired
                  labelPlacement="outside"
                  label="Division"
                  name="divisionId"
                  variant="bordered"
                  radius="sm"
                  placeholder="Select a division"
                  selectedKeys={[formik.values.divisionId.toString()]}
                  value={formik.values.divisionId.toString()}
                  onChange={handleChangeInput}
                  className="bg-transparent drop-shadow-sm  rounded-md"
                >
                  {optionsDivision.map((option:any) => (
                    <SelectItem key={option.id.toString()}  value={option.id.toString()}>{option.division}</SelectItem>
                  ))}
                </NextSelect>
              <NextSelect
              isRequired
                  labelPlacement="outside"
                  label="Position"
                  name="positionId"
                  variant="bordered"
                  radius="sm"
                  placeholder="Select a position"
                  selectedKeys={[formik.values.positionId.toString()]}
                  value={formik.values.positionId.toString()}
                  onChange={handleChangeInput}
                  className="bg-transparent drop-shadow-sm  rounded-md"
                >
                  {optionsPosition.map((option :any) => (
                    <SelectItem key={option.id.toString()} value={option.id.toString()}>{option.position}</SelectItem>
                  ))}
              </NextSelect>
              <NextSelect
                  isRequired
                  labelPlacement="outside"
                  label="Role"
                  name="role"
                  variant="bordered"
                  radius="sm"
                  placeholder="Select a role"
                  selectedKeys={[formik.values.role]}
                  value={formik.values.role.toString()}
                  onChange={handleChangeInput}
                  className="bg-transparent drop-shadow-sm  rounded-md"
                >           
                    <SelectItem key="sales" value="sales">Sales</SelectItem>     
                    <SelectItem key="superuser" value="superuser">Super User</SelectItem>
                    <SelectItem key="supir" value="supir">Supir</SelectItem>
                    <SelectItem key="spv" value="spv">SPV</SelectItem>
                    <SelectItem key="manager" value="manager">Manager</SelectItem>
                    <SelectItem key="admin" value="admin">Admin</SelectItem>
              </NextSelect>
              <div>
              <h3 className={`text-sm -mt-[3px] ml-0.5`}>Manager </h3>
               <Select
                  className={`basic-single mt-[7px]`}
                  classNamePrefix="select"
                  placeholder="Select a manager"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="manager"
                  value={user.find(option => option.value === formik.values.manager) || null} 
                  options={user}
                  onChange={(selectedOption, actionMeta) =>
                    handleSelectChange(selectedOption, actionMeta, false) 
                  }
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderWidth: '1px',  
                      borderColor: 'rgba(0, 0, 0, 0.12)', 
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
              </div>
              <div>
                <h3 className={`text-sm -mt-[3px] ml-0.5`}>Supervisor</h3>
               <Select
                  className="basic-multi-select mt-2"
                  classNamePrefix="select"
                  placeholder="Select a supervisor"
                  isDisabled={false}
                  isLoading={false} 
                  isMulti={true}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="supervisor"
                  value={
                    Array.isArray(formik.values.supervisor)
                      ? formik.values.supervisor.map(value => user.find(option => option.value === value))
                      : user.find(option => option.value === formik.values.supervisor) || null
                  }
                  options={user}
                  onChange={(selectedOption, actionMeta) =>
                    handleSelectChange(selectedOption, actionMeta, true) 
                  }                  
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderWidth: '1px',  
                      borderColor: 'rgba(0, 0, 0, 0.12)', 
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
              </div>
              <div></div>
                <section className="container">
                  <div>
                    <label className="text-[#020617] text-sm">Image Profile</label>
                  </div>
                  <div className="flex-1 items-center max-w-screen-sm mx-auto mb-3 space-y-4 sm:flex sm:space-y-0 mt-1">
                    <div className="relative w-full">
                      {/* Ensure that the spread props are applied correctly here */}
                      <div {...getRootProps({ className: 'dropzone' })} className="items-center justify-center max-w-xl mx-auto">
                        <label
                          className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                          id="drop"
                        >
                          <span className="flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="font-medium text-gray-600">
                              Drop files to Attach, or
                              <span className="text-blue-600 underline ml-[4px]">browse</span>
                            </span>
                          </span>
                          {/* Ensure getInputProps is used correctly here */}
                          <input {...getInputProps()} type="file" name="file_upload" className="hidden" accept="image/png,image/jpeg" id="input" />
                        </label>
                      </div>
                    </div>
                  </div>
                  </section>
                  <div>
                    <label className="text-[#020617] text-sm">Preview</label>
                    {imagePreview}
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
            </form>
          </Card>
        </div>
      </div>
    );
  }

