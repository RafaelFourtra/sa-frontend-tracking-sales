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
import { Button, Card, CardBody, CardFooter, Tabs, 
  Tab, 
  RadioGroup, 
  Radio, 
  Checkbox, 
  Textarea, 
  Divider, 
  Select as NextSelect, 
  SelectItem,
  Image,
  DatePicker,
  Form, 
  Input } from "@nextui-org/react";
import { useDropzone } from 'react-dropzone'
import Select from 'react-select';
import Cookies from "js-cookie";
import { parseDate } from "@internationalized/date";


interface PelangganData {
  PERSONNO: string
  SUBPERSON: string
  PARENTPERSON: string
  NAME: string
  ADDRESSLINE1: string
  ADDRESSLINE2: string
  CITY: string
  STATEPROV: string
  ZIPCODE: string
  COUNTRY: string
  PHONE1: string
  PHONE2: string
  FAX: string
  CONTACT: string
  EMAIL: string
  WEBPAGE: string
  SUSPENDED: boolean
  CREDITLIMIT: string
  TERMSID: string
  SALESMANID: string
  TIMSALESID: string
  PRICELEVEL1: string
  PRICELEVEL2: string
  TAXID: string
  TYPEID: string
  CUSTCATEGORYID: string
  TARGET: string
  NIK: string
  NAMA_LENGKAP: string
  TEMPAT_LAHIR: string
  TANGGAL_LAHIR: string
  KEWARGANEGARAAN: string
  JENIS_KELAMIN: string
  ALAMAT_DOMISILI: string
  RT: string
  RW: string
  KELURAHAN: string
  KECAMATAN: string
  KOTA: string
  KODEPOS: string
  TELP: string
  NOHP: string
  NOHP2: string
  EMAIL2: string
  STATUS_TEMPAT: string
  LAMA_TINGGAL: string
  STATUS_PERNIKAHAN: string
  JUMLAH_TANGUNGAN: string
  PENDIDIKAN_TERAKHIR: string
  NAMA_IBUKANDUNG: string
  NAMA_LENGKAP2: string
  HUBUNGAN: string
  ALAMAT2: string
  RT2: string
  RW2: string
  KOTA2: string
  KODEPOS2: string
  TELP2: string
  HANDPHONE: string
  FOTO: string
  FOTO_KTP: string
  STATUS_PELANGGAN: string
  STATUS_ORDER: string
}

export const PelangganEdit = () => {
  const token = Cookies.get("auth_token");
  const [isLoading, setIsLoading] = useState(false);
  const [term, setTerm] = useState([]);
  const [tax, setTax] = useState([]);
  const [salesMan, setSalesMan] = useState([]);
  const [timSales, setTimSales] = useState([]);
  const [custCategory, setCustCategory] = useState([]);
  const [custType, setCustType] = useState([]);
  const [priceNameOne, setPriceNameOne] = useState([]);
  const [priceNameTwo, setPriceNameTwo] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);
  const [filteredPelanggan, setFilteredPelanggan] = useState([]);
  const [detailTerm, setDetailTerm] = useState([]);
  const [filesPreview, setFilesPreview] = useState([]);
  const [filesPreview2, setFilesPreview2] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Pelanggan" },
    { label: "Edit" },
  ];

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const statusPelanggan = [
    { value: 0, label: "Pelanggan Baru" },
    { value: 1, label: "Pelanggan Lama" },
    { value: 2, label: "Pelanggan Aktif" },
  ];

  const statusOrder = [
    { value: 1, label: "YES" },
    { value: 2, label: "NO" },
  ];

  const fetchData = async () => {
    // Pelanggan Edit
    const responseDataPelangganEdit = await fetch(
      `${process.env.NEXT_PUBLIC_PELANGGAN_EDIT_URL_API}${id}`,
        { 
          cache: "no-store", 
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      )

    const dataPelangganEdit = await responseDataPelangganEdit.json()
      Object.keys(dataPelangganEdit.data).forEach((key) => {
          formik.setFieldValue(key, dataPelangganEdit.data[key]);
      });

      if (dataPelangganEdit.data?.FOTO_KTP) {
        const imageFotoKtpUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_API}/uploads/pelanggan/foto-ktp/${dataPelangganEdit.data.FOTO_KTP}`;
        const imageFotoKtpName = dataPelangganEdit.data.FOTO_KTP.split('/').pop();  

        setFilesPreview([{ preview: imageFotoKtpUrl, name: imageFotoKtpName }]);
      }
      if (dataPelangganEdit.data?.FOTO) {
        const imageFotoUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_API}/uploads/pelanggan/foto/${dataPelangganEdit.data.FOTO}`;
        const imageFotoName = dataPelangganEdit.data.FOTO.split('/').pop();  

        setFilesPreview2([{ preview: imageFotoUrl, name: imageFotoName }]);
      }
     
    // Sales Man
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
    if(dataSalesMan.status && dataSalesMan.status == 200) {
      const formattedSalesman = dataSalesMan.data.map((salesman :any) => ({
        label: salesman.SALESMANNAME,  
        value: salesman.SALESMANID    
      }));
      setSalesMan(formattedSalesman || [])
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
    if(dataTimSales.status && dataTimSales.status == 200) {
      const formattedTimsales = dataTimSales.data.map((timsales :any) => ({
        label: timsales.NAME,  
        value: timsales.ID    
      }));
      setTimSales(formattedTimsales || [])
    }

    // Term Opmt
    const responseDataTermOpmt = await fetch(
      `${process.env.NEXT_PUBLIC_TERM_OPMT_DATATABLE_URL_API}`,
       { 
          cache: "no-store", 
          headers: {
          "Authorization": `Bearer ${token}`,
          },
       }
    )

    const dataTermOpmt = await responseDataTermOpmt.json()
    if(dataTermOpmt.status && dataTermOpmt.status == 200) {
      const formattedTermOpmt = dataTermOpmt.data.map((term :any) => ({
        label: term.TERMNAME,  
        value: term.TERMID,
        DISCPC: term.DISCPC,
        DISCDAYS: term.DISCDAYS,
        NETDAYS: term.NETDAYS 
      }));
      setTerm(formattedTermOpmt || [])
    }

    // Cust Category
    const responseDataCustCategory = await fetch(
      `${process.env.NEXT_PUBLIC_CUST_CATEGORY_DATATABLE_URL_API}`,
       { 
          cache: "no-store", 
          headers: {
          "Authorization": `Bearer ${token}`,
          },
       }
    )

    const dataCustCategory = await responseDataCustCategory.json()
    if(dataCustCategory.status && dataCustCategory.status == 200) {
      const formattedCustCategory = dataCustCategory.data.map((custCat :any) => ({
        label: custCat.NAME,  
        value: custCat.ID    
      }));
      setCustCategory(formattedCustCategory || [])
    }    

    // Cust Type
    const responseDataCustType = await fetch(
      `${process.env.NEXT_PUBLIC_CUST_TYPE_DATATABLE_URL_API}`,
       { 
          cache: "no-store", 
          headers: {
          "Authorization": `Bearer ${token}`,
          },
       }
    )

    const dataCustType = await responseDataCustType.json()
    if(dataCustType.status && dataCustType.status == 200) {
      const formattedCustType = dataCustType.data.map((custType :any) => ({
        label: custType.NAME,  
        value: custType.ID    
      }));
      setCustType(formattedCustType || [])
    }  
    
    // Tax
    const responseDataTax = await fetch(
      `${process.env.NEXT_PUBLIC_TAX_DATATABLE_URL_API}`,
       { 
          cache: "no-store", 
          headers: {
          "Authorization": `Bearer ${token}`,
          },
       }
    )

    const dataTax = await responseDataTax.json()
    if(dataTax.status && dataTax.status == 200) {
      const formattedTax = dataTax.data.map((tax :any) => ({
        label: tax.NAME,  
        value: tax.ID    
      }));
      setTax(formattedTax || [])
    }     

    // Price Name One
    const responseDataPriceNameOne = await fetch(
      `${process.env.NEXT_PUBLIC_PRICENAME_ONE_DATATABLE_URL_API}`,
       { 
          cache: "no-store", 
          headers: {
          "Authorization": `Bearer ${token}`,
          },
       }
    )

    const dataPriceNameOne = await responseDataPriceNameOne.json()
    if(dataPriceNameOne.status && dataPriceNameOne.status == 200) {
      const formattedPriceNameOne = dataPriceNameOne.data.map((priceOne :any) => ({
        label: priceOne.NAME,  
        value: priceOne.ID    
      }));
      setPriceNameOne(formattedPriceNameOne || [])
    }     

    // Price Name Two
    const responseDataPriceNameTwo = await fetch(
      `${process.env.NEXT_PUBLIC_PRICENAME_TWO_DATATABLE_URL_API}`,
       { 
          cache: "no-store", 
          headers: {
          "Authorization": `Bearer ${token}`,
          },
       }
    )

    const dataPriceNameTwo = await responseDataPriceNameTwo.json()
    if(dataPriceNameTwo.status && dataPriceNameTwo.status == 200) {
      const formattedPriceNameTwo = dataPriceNameTwo.data.map((priceTwo :any) => ({
        label: priceTwo.NAME,  
        value: priceTwo.NAME    
      }));
      setPriceNameTwo(formattedPriceNameTwo || [])
    }    
  
    // Pelanggan
    const responseDataPelanggan = await fetch(
        `${process.env.NEXT_PUBLIC_PELANGGAN_DATATABLE_URL_API}`,
         { 
            cache: "no-store", 
            headers: {
            "Authorization": `Bearer ${token}`,
            },
         }
    )
  
    const dataPelanggan = await responseDataPelanggan.json()
    if(dataPelanggan.status && dataPelanggan.status == 200) {
      const formattedPelanggan = dataPelanggan.data.map((pelanggan :any) => ({
          label: `${pelanggan.NAME} (${pelanggan.PERSONNO})`,  
          value: pelanggan.PERSONNO  
        }));
        setPelanggan(formattedPelanggan || [])
    }    

    
  };

  useEffect(() => {
    fetchData();
  }, []);


   const createDropzoneHandler = (setFilesPreview) => ({
      onDrop: (acceptedFiles) => {
        const validFiles = acceptedFiles.filter((file) => file.type.startsWith('image/'));
  
        if (validFiles.length !== acceptedFiles.length) {
          toast.error('Hanya file gambar yang diperbolehkan.', {
            position: "top-right",
            autoClose: 4000,
            pauseOnHover: true,
          });
        }
  
        setFilesPreview(
          validFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )
        );
      },
    });
  
    const dropzone1 = useDropzone(createDropzoneHandler(setFilesPreview));
    const dropzone2 = useDropzone(createDropzoneHandler(setFilesPreview2));
  
    useEffect(() => {
      return () => {
        filesPreview.forEach((file) => URL.revokeObjectURL(file.preview));
      };
    }, [filesPreview]);
  
    useEffect(() => {
      return () => {
        filesPreview2.forEach((file) => URL.revokeObjectURL(file.preview));
      };
    }, [filesPreview2]);
  
    const imagePreview = filesPreview.map((file) => (
      <Image
        key={file.name}
        className="bg-auto"
        width={240}
        height={140}
        alt={`Preview of ${file.name}`}
        src={file.preview}
      />
    ));
  
  
    const imagePreview2 = filesPreview2.map((file) => (
      <Image
        key={file.name}
        className="bg-auto"
        width={240}
        height={140}
        alt={`Preview of ${file.name}`}
        src={file.preview}
      />
    ));

    const handleInputChange = (value) => {
      if (value.trim().length > 0) {
        const filtered = pelanggan.filter((option) =>
          option.label?.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 100);
        setFilteredPelanggan(filtered);
      } else {
        setFilteredPelanggan([]);
      } 
    };
  
    const validateSchema = Yup.object().shape({
      PERSONNO : Yup.string().required("No. Pelanggan wajib diisi"),
      NAME : Yup.string().required("Nama wajib diisi"),
      TERMSID : Yup.string().required("Termin wajib diisi"),
      SALESMANID : Yup.string().required("Penjual wajib diisi"),
      TIMSALESID : Yup.string().required("Tim sales wajib diisi"),
      TYPEID : Yup.string().required("Tipe pelanggan wajib diisi"),
      CUSTCATEGORYID : Yup.string().required("Kategori pelanggan wajib diisi"),
      PRICELEVEL2 : Yup.string().required("Tingkatan harga jual wajib diisi"),
    });

  const formik = useFormik<PelangganData>({
    initialValues: {
      PERSONNO: "",
      SUBPERSON: "",
      PARENTPERSON: "",
      NAME: "",
      ADDRESSLINE1: "",
      ADDRESSLINE2: "",
      CITY: "",
      STATEPROV: "",
      ZIPCODE: "",
      COUNTRY: "",
      PHONE1: "",
      PHONE2: "",
      FAX: "",
      CONTACT: "",
      EMAIL: "",
      WEBPAGE: "",
      SUSPENDED: false,
      CREDITLIMIT: "0",
      TERMSID: "",
      SALESMANID: "",
      TIMSALESID: "",
      PRICELEVEL1: "",
      PRICELEVEL2: "",
      TAXID: "2",
      TYPEID: "",
      CUSTCATEGORYID: "",
      TARGET: "0",
      NIK: "",
      NAMA_LENGKAP: "",
      TEMPAT_LAHIR: "",
      TANGGAL_LAHIR: "",
      KEWARGANEGARAAN: "",
      JENIS_KELAMIN: "",
      ALAMAT_DOMISILI: "",
      RT: "",
      RW: "",
      KELURAHAN: "",
      KECAMATAN: "",
      KOTA: "",
      KODEPOS: "",
      TELP: "",
      NOHP: "",
      NOHP2: "",
      EMAIL2: "",
      STATUS_TEMPAT: "",
      LAMA_TINGGAL: "",
      STATUS_PERNIKAHAN: "",
      JUMLAH_TANGUNGAN: "",
      PENDIDIKAN_TERAKHIR: "",
      NAMA_IBUKANDUNG: "",
      NAMA_LENGKAP2: "",
      HUBUNGAN: "",
      ALAMAT2: "",
      RT2: "",
      RW2: "",
      KOTA2: "",
      KODEPOS2: "",
      TELP2: "",
      HANDPHONE: "",
      FOTO: "",
      FOTO_KTP: "",
      STATUS_PELANGGAN: "",
      STATUS_ORDER: "",  
    },
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (navigator.onLine) {
        try {
          const formData = new FormData();

          Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
          })

          if (filesPreview.length > 0) {
            const file = filesPreview[0];
            if (file.size > 307200) {
              toast.error('File terlalu besar. Maksimal ukuran file adalah 300 KB.', {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              setIsLoading(false);
              return;
            }
            formData.append('FOTO_KTP', file); 
          }
      
          if (filesPreview2.length > 0) {
            const file2 = filesPreview2[0];
            if (file2.size > 307200) {
              toast.error('File terlalu besar. Maksimal ukuran file adalah 300 KB.', {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              setIsLoading(false);
              return;
            }
            formData.append('FOTO', file2);       
          }


          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PELANGGAN_UPDATE_URL_API}${id}`,
            {
              method: "PUT",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
              body: formData,
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
              setFilesPreview2([])
              setTimeout(async () => {
                setIsLoading(false);
                router.push("/master/pelanggan");
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
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      toast.error("Validasi gagal, periksa kembali kolom yang terdapat error!", {
        position: "top-right",
        autoClose: 4000,
        pauseOnHover: true,
        transition: Bounce,
      });
    }
  }, [formik.submitCount, formik.errors]);
  const handleChangeInput= (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target  as HTMLInputElement;
    formik.setFieldValue(name as keyof PelangganData, value);
  }

  const handleSelectChange = (selectedOption, { name }, isMulti) => {
    const value = isMulti
      ? Array.isArray(selectedOption)
        ? selectedOption.map(option => option.value)
        : [] 
      : selectedOption ? selectedOption.value : ''; 
    
    if(name == "TERMSID") {
      const filteredTerm = term.filter((option) => {
        return option.value == value;
      });
      setDetailTerm(filteredTerm)
    }
    formik.setFieldValue(name, value);
  };

  useEffect(() => {
    const TANGGAL_LAHIR = formik.values.TANGGAL_LAHIR;
    if (TANGGAL_LAHIR) {
      const formattedDateString = TANGGAL_LAHIR.split('T')[0];
      if (formattedDateString === "0000-00-00" || formattedDateString === null) {
        setSelectedDate(null);
      } else {
        const initialParsedDate = parseDate(formattedDateString);
        setSelectedDate(initialParsedDate);
      }
    }
  }, [formik.values.TANGGAL_LAHIR]);

  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer />
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">Edit Pelanggan</h3>
        <div className="flex flex-row items-center gap-2.5 flex-wrap">
          <Button
            size="md"
            className="flex items-center bg-[#FFDD00]"
            onClick={() => router.push("/master/pelanggan/")}
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
          <div className="flex w-full flex-col">
            <Tabs aria-label="Options" className="[--tab-highlight-color:#FFDD00]"
              classNames={{
                tabList: "bg-[#FFDD00]/10",                   
                cursor: "bg-[#FFDD00]",                        
                tab: "text-[#FFDD00] data-[hover=true]:text-[#FFDD00]/80", 
                tabContent: "group-data-[selected=true]:text-black"        
              }}>
              <Tab key="alamat" title="Alamat">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                      autoFocus
                      isRequired
                      labelPlacement="outside"
                      label="No. Pelanggan"
                      radius="sm"
                      name="PERSONNO"
                      value={formik.values.PERSONNO}
                      placeholder="Enter no pelangggan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.PERSONNO ? true : false}
                      errorMessage = {formik.errors.PERSONNO ? formik.errors.PERSONNO : ''}
                    /> 
                    <div className="flex">
                    <Checkbox 
                      size="sm" 
                      className="float-end"
                      name="SUSPENDED" 
                      checked={formik.values.SUSPENDED}
                      onChange={formik.handleChange}>
                      Non Aktif
                    </Checkbox>
                    </div>
                    <div>
                      <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.PARENTPERSON ? 'text-[#F31260]' : ''}`}>Induk Pelanggan</h3>
                      <Select
                          className={`text-sm basic-single mt-2 ${formik.errors.PARENTPERSON ? 'is-invalid' : ''}`}
                          classNamePrefix="select"
                          placeholder="Select a induk pelanggan"
                          isDisabled={false}
                          isLoading={false} 
                          isClearable={true}
                          isRtl={false}
                          isSearchable={true}
                          name="PARENTPERSON"
                          options={filteredPelanggan || []}
                          value={pelanggan.find(option => option.value === formik.values.PARENTPERSON) || null} 
                          onInputChange={(value) => handleInputChange(value)}
                          onChange={(selectedOption, actionMeta) =>
                            handleSelectChange(selectedOption, actionMeta, false) 
                          }                  
                          styles={{
                            control: (base :any) => ({
                              ...base,
                              backgroundColor: 'transparent',  
                              borderWidth: formik.errors.PARENTPERSON ? '2px' : '1px',  
                              borderColor: formik.errors.PARENTPERSON
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
                              fontSize: '0.875rem'
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
                        {formik.errors.PARENTPERSON && (
                            <span className="text-[#F31260] text-xs ml-1">{formik.errors.PARENTPERSON}</span>
                          )}
                  </div>
                    <Input
                      autoFocus
                      isRequired
                      labelPlacement="outside"
                      label="Nama Pelanggan"
                      radius="sm"
                      name="NAME"
                      value={formik.values.NAME}
                      placeholder="Enter nama pelangggan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.NAME ? true : false}
                      errorMessage = {formik.errors.NAME ? formik.errors.NAME : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Alamat 1"
                      radius="sm"
                      name="ADDRESSLINE1"
                      value={formik.values.ADDRESSLINE1}
                      placeholder="Enter alamat 1"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.ADDRESSLINE1 ? true : false}
                      errorMessage = {formik.errors.ADDRESSLINE1 ? formik.errors.ADDRESSLINE1 : ''}
                    /> 
                   <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Alamat 2"
                      radius="sm"
                      name="ADDRESSLINE2"
                      value={formik.values.ADDRESSLINE2}
                      placeholder="Enter alamat 2"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.ADDRESSLINE2 ? true : false}
                      errorMessage = {formik.errors.ADDRESSLINE2 ? formik.errors.ADDRESSLINE2 : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Kota"
                      radius="sm"
                      name="CITY"
                      value={formik.values.CITY}
                      placeholder="Enter kota"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.CITY ? true : false}
                      errorMessage = {formik.errors.CITY ? formik.errors.CITY : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Provinsi"
                      radius="sm"
                      name="STATEPROV"
                      value={formik.values.STATEPROV}
                      placeholder="Enter provinsi"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.STATEPROV ? true : false}
                      errorMessage = {formik.errors.STATEPROV ? formik.errors.STATEPROV : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Kode Pos"
                      radius="sm"
                      name="ZIPCODE"
                      type="number"
                      value={formik.values.ZIPCODE}
                      placeholder="Enter kode pos"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.ZIPCODE ? true : false}
                      errorMessage = {formik.errors.ZIPCODE ? formik.errors.ZIPCODE : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Negara"
                      radius="sm"
                      name="COUNTRY"
                      value={formik.values.COUNTRY}
                      placeholder="Enter negara"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.COUNTRY ? true : false}
                      errorMessage = {formik.errors.COUNTRY ? formik.errors.COUNTRY : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Telepon"
                      radius="sm"
                      name="PHONE1"
                      value={formik.values.PHONE1}
                      placeholder="Enter telepon"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.PHONE1 ? true : false}
                      errorMessage = {formik.errors.PHONE1 ? formik.errors.PHONE1 : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Handphone"
                      radius="sm"
                      name="PHONE2"
                      value={formik.values.PHONE2}
                      placeholder="Enter handphone"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.PHONE2 ? true : false}
                      errorMessage = {formik.errors.PHONE2 ? formik.errors.PHONE2 : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Faksimili"
                      radius="sm"
                      name="FAX"
                      value={formik.values.FAX}
                      placeholder="Enter faksimili"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.FAX ? true : false}
                      errorMessage = {formik.errors.FAX ? formik.errors.FAX : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Personal Kontak"
                      radius="sm"
                      name="CONTACT"
                      value={formik.values.CONTACT}
                      placeholder="Enter personal kontak"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.CONTACT ? true : false}
                      errorMessage = {formik.errors.CONTACT ? formik.errors.CONTACT : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Email"
                      radius="sm"
                      name="EMAIL"
                      type="email"
                      value={formik.values.EMAIL}
                      placeholder="Enter email"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.EMAIL ? true : false}
                      errorMessage = {formik.errors.EMAIL ? formik.errors.EMAIL : ''}
                    /> 
                    <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Halaman Web"
                      radius="sm"
                      name="WEBPAGE"
                      value={formik.values.WEBPAGE}
                      placeholder="Enter halaman web"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.WEBPAGE ? true : false}
                      errorMessage = {formik.errors.WEBPAGE ? formik.errors.WEBPAGE : ''}
                    /> 
                </div>
              </Tab>
              <Tab key="termin" title="Termin">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.TERMSID ? 'text-[#F31260]' : ''}`}>Termin <span className="text-red-500">*</span></h3>
                    <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.TERMSID ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a termin"
                        isDisabled={false}
                        isLoading={false} 
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="TERMSID"
                        options={term}
                        value={term.find(option => option.value === formik.values.TERMSID) || null} 
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta, false) 
                        }                  
                        styles={{
                          control: (base :any) => ({
                            ...base,
                            backgroundColor: 'transparent',  
                            borderWidth: formik.errors.TERMSID ? '2px' : '1px',  
                            borderColor: formik.errors.TERMSID
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
                            fontSize: '0.875rem'
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
                      {formik.errors.TERMSID && (
                          <span className="text-[#F31260] text-xs ml-1">{formik.errors.TERMSID}</span>
                        )}
                  </div>
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Batasan Piutang"
                      radius="sm"
                      name="CREDITLIMIT"
                      type="number"
                      value={formik.values.CREDITLIMIT}
                      placeholder="Enter batasan piutang"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.CREDITLIMIT ? true : false}
                      errorMessage = {formik.errors.CREDITLIMIT ? formik.errors.CREDITLIMIT : ''}
                    /> 
                    {detailTerm.map((item) => {
                      return <div className="flex">
                        <h3 className={`text-sm -mt-[3px] ml-0.5`}>% Diskon <span className="font-bold">{item.DISCPC}</span></h3>
                        <h3 className={`text-sm -mt-[3px] ml-5`}>Hari Disk <span className="font-bold">{item.DISCDAYS}</span></h3>
                        <h3 className={`text-sm -mt-[3px] ml-5`}>Jatuh Tempo <span className="font-bold">{item.NETDAYS}</span></h3>
                      </div>
                    })}
                </div>
              </Tab>
              <Tab key="penjualan" title="Penjualan">
                <div className="grid grid-cols-2 gap-4">
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
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta, false) 
                        }                  
                        styles={{
                          control: (base :any) => ({
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
                          menu: (base :any) => ({
                            ...base,
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            zIndex: 1050,
                          }),
                          menuPortal: (base :any) => ({
                            ...base,
                            zIndex: 1050,
                            fontSize: '0.875rem'
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
                      {formik.errors.SALESMANID && (
                          <span className="text-[#F31260] text-xs ml-1">{formik.errors.SALESMANID}</span>
                        )}
                  </div>
                  <div>
                    <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.TIMSALESID ? 'text-[#F31260]' : ''}`}>Tim Sales <span className="text-red-500">*</span></h3>
                    <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.TIMSALESID ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a timsales"
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
                          control: (base :any) => ({
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
                          menu: (base :any) => ({
                            ...base,
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            zIndex: 1050,
                          }),
                          menuPortal: (base :any) => ({
                            ...base,
                            zIndex: 1050,
                            fontSize: '0.875rem'
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
                      {formik.errors.TIMSALESID && (
                          <span className="text-[#F31260] text-xs ml-1">{formik.errors.TIMSALESID}</span>
                        )}
                  </div>
                  <div>
                    <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.PRICELEVEL1 ? 'text-[#F31260]' : ''}`}>Tingkat Harga Jual Lama </h3>
                    <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.PRICELEVEL1 ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a tingat harga jual lama"
                        isDisabled={false}
                        isLoading={false} 
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="PRICELEVEL1"
                        options={priceNameOne}
                        value={priceNameOne.find(option => option.value === formik.values.PRICELEVEL1) || null} 
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta, false) 
                        }                  
                        styles={{
                          control: (base :any) => ({
                            ...base,
                            backgroundColor: 'transparent',  
                            borderWidth: formik.errors.PRICELEVEL1 ? '2px' : '1px',  
                            borderColor: formik.errors.PRICELEVEL1
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
                            fontSize: '0.875rem'
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
                      {formik.errors.PRICELEVEL1 && (
                          <span className="text-[#F31260] text-xs ml-1">{formik.errors.PRICELEVEL1}</span>
                        )}
                  </div>
                  <div>
                    <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.PRICELEVEL2 ? 'text-[#F31260]' : ''}`}>Tingkatan Harga Jual Baru <span className="text-red-500">*</span></h3>
                    <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.PRICELEVEL2 ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a tingkatan harga jual baru"
                        isDisabled={false}
                        isLoading={false} 
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="PRICELEVEL2"
                        options={priceNameTwo}
                        value={priceNameTwo.find(option => option.value === formik.values.PRICELEVEL2) || null} 
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta, false) 
                        }                  
                        styles={{
                          control: (base :any) => ({
                            ...base,
                            backgroundColor: 'transparent',  
                            borderWidth: formik.errors.PRICELEVEL2 ? '2px' : '1px',  
                            borderColor: formik.errors.PRICELEVEL2
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
                            fontSize: '0.875rem'
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
                      {formik.errors.PRICELEVEL2 && (
                          <span className="text-[#F31260] text-xs ml-1">{formik.errors.PRICELEVEL2}</span>
                        )}
                  </div>
                  <div>
                    <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.TYPEID ? 'text-[#F31260]' : ''}`}>Tipe Pelanggan <span className="text-red-500">*</span></h3>
                    <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.TYPEID ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a tipe pelanggan"
                        isDisabled={false}
                        isLoading={false} 
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="TYPEID"
                        options={custType}
                        value={custType.find(option => option.value === formik.values.TYPEID) || null} 
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta, false) 
                        }                  
                        styles={{
                          control: (base :any) => ({
                            ...base,
                            backgroundColor: 'transparent',  
                            borderWidth: formik.errors.TYPEID ? '2px' : '1px',  
                            borderColor: formik.errors.TYPEID
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
                            fontSize: '0.875rem'
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
                      {formik.errors.TYPEID && (
                          <span className="text-[#F31260] text-xs ml-1">{formik.errors.TYPEID}</span>
                        )}
                  </div>
                  <div>
                    <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.CUSTCATEGORYID ? 'text-[#F31260]' : ''}`}>Kategori Pelanggan <span className="text-red-500">*</span></h3>
                    <Select
                        className={`text-sm basic-single mt-2 ${formik.errors.CUSTCATEGORYID ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        placeholder="Select a kategori pelanggan"
                        isDisabled={false}
                        isLoading={false} 
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="CUSTCATEGORYID"
                        options={custCategory}
                        value={custCategory.find(option => option.value === formik.values.CUSTCATEGORYID) || null} 
                        onChange={(selectedOption, actionMeta) =>
                          handleSelectChange(selectedOption, actionMeta, false) 
                        }                  
                        styles={{
                          control: (base :any) => ({
                            ...base,
                            backgroundColor: 'transparent',  
                            borderWidth: formik.errors.CUSTCATEGORYID ? '2px' : '1px',  
                            borderColor: formik.errors.CUSTCATEGORYID
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
                            zIndex: 1000
                          }),
                          menuList: (base: any) => ({
                            ...base,
                            maxHeight: '150px',
                            overflowY: 'auto',
                          }),
                          menuPortal: (base :any) => ({
                            ...base,
                            zIndex: 1000,
                            fontSize: '0.875rem'
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
                      {formik.errors.CUSTCATEGORYID && (
                          <span className="text-[#F31260] text-xs ml-1">{formik.errors.CUSTCATEGORYID}</span>
                        )}
                  </div>
                  <div>
                    <h3 className={`text-sm -mt-[3px] ml-0.5 ${formik.errors.TAXID ? 'text-[#F31260]' : ''}`}>Tipe Pajak</h3>
                    <RadioGroup
                      size="sm"
                      isInvalid={formik.errors.TAXID ? true : false}
                      className="mt-2"
                      value={formik.values.TAXID}
                      name="TAXID"
                      orientation="horizontal"
                      onChange={(e) => formik.setFieldValue('TAXID', e.target.value)} 
                    >
                     {tax.map((item :any) => {
                        return <Radio value={item.value?.toString()}>{item.label}</Radio>
                     })}
                    </RadioGroup>
                  </div>
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Target Penjualan"
                      type="number"
                      radius="sm"
                      name="TARGET"
                      value={formik.values.TARGET}
                      placeholder="Enter target penjualan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.TARGET ? true : false}
                      errorMessage = {formik.errors.TARGET ? formik.errors.TARGET : ''}
                    /> 
                </div>
              </Tab>
              <Tab key="informasi-pribadi" title="Informasi Pribadi">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="NIK"
                      radius="sm"
                      name="NIK"
                      value={formik.values.NIK}
                      placeholder="Enter nik"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.NIK ? true : false}
                      errorMessage = {formik.errors.NIK ? formik.errors.NIK : ''}
                  />    
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Nama Lengkap"
                      radius="sm"
                      name="NAMA_LENGKAP"
                      value={formik.values.NAMA_LENGKAP}
                      placeholder="Enter nama lengkap"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.NAMA_LENGKAP ? true : false}
                      errorMessage = {formik.errors.NAMA_LENGKAP ? formik.errors.NAMA_LENGKAP : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Tempat Lahir"
                      radius="sm"
                      name="TEMPAT_LAHIR"
                      value={formik.values.TEMPAT_LAHIR}
                      placeholder="Enter tempat lahir"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.TEMPAT_LAHIR ? true : false}
                      errorMessage = {formik.errors.TEMPAT_LAHIR ? formik.errors.TEMPAT_LAHIR : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Kewarganegaraan"
                      radius="sm"
                      name="KEWARGANEGARAAN"
                      value={formik.values.KEWARGANEGARAAN}
                      placeholder="Enter kewarganegaraan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.KEWARGANEGARAAN ? true : false}
                      errorMessage = {formik.errors.KEWARGANEGARAAN ? formik.errors.KEWARGANEGARAAN : ''}
                  /> 
                  <DatePicker
                    isRequired
                    name="TANGGAL_LAHIR"
                    label={"Tanggal Lahir"}
                    variant="bordered"
                    labelPlacement="outside"
                    value={selectedDate}
                    onChange={(value) => {
                      if (value) {
                        const { year, month, day } = value;
                        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        formik.setFieldValue("TANGGAL_LAHIR", formattedDate);
                        const initialParsedDate = parseDate(formattedDate);
                        setSelectedDate(initialParsedDate);
                      }
                    }}
                    isInvalid={formik.errors.TANGGAL_LAHIR ? true : false}
                    errorMessage={formik.errors.TANGGAL_LAHIR ? formik.errors.TANGGAL_LAHIR : ''}
                  />
                  <NextSelect
                    labelPlacement="outside"
                    label="Jenis Kelamin"
                    name="JENIS_KELAMIN"
                    variant="bordered"
                    radius="sm"
                    placeholder="Select a jenis kelamin"
                    value={formik.values.JENIS_KELAMIN}
                    onChange={handleChangeInput}
                    selectedKeys={[formik.values.JENIS_KELAMIN]}
                    className="bg-transparent drop-shadow-sm  rounded-md"
                  >                
                      <SelectItem key={"Laki-Laki"}>
                       Laki-laki
                      </SelectItem>
                      <SelectItem key={"Perempuan"}>
                       Perempuan
                      </SelectItem>
                  </NextSelect>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Textarea
                    className=""
                    label="Alamat Domisili"
                    name="ALAMAT_DOMISILI"
                    labelPlacement="outside"
                    placeholder="Enter alamat domisili"
                    value={formik.values.ALAMAT_DOMISILI}
                    onChange={handleChangeInput} 
                    variant="bordered"
                    isInvalid = {formik.errors.ALAMAT_DOMISILI ? true : false}
                    errorMessage = {formik.errors.ALAMAT_DOMISILI ? formik.errors.ALAMAT_DOMISILI : ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="RT"
                      radius="sm"
                      name="RT"
                      value={formik.values.RT}
                      placeholder="Enter rt"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.RT ? true : false}
                      errorMessage = {formik.errors.RT ? formik.errors.RT : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="RW"
                      radius="sm"
                      name="RW"
                      value={formik.values.RW}
                      placeholder="Enter rw"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.RW ? true : false}
                      errorMessage = {formik.errors.RW ? formik.errors.RW : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Kelurahan"
                      radius="sm"
                      name="KELURAHAN"
                      value={formik.values.KELURAHAN}
                      placeholder="Enter kelurahan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.KELURAHAN ? true : false}
                      errorMessage = {formik.errors.KELURAHAN ? formik.errors.KELURAHAN : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Kecamatan"
                      radius="sm"
                      name="KECAMATAN"
                      value={formik.values.KECAMATAN}
                      placeholder="Enter kecamatan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.KECAMATAN ? true : false}
                      errorMessage = {formik.errors.KECAMATAN ? formik.errors.KECAMATAN : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Kota"
                      radius="sm"
                      name="KOTA"
                      value={formik.values.KOTA}
                      placeholder="Enter kota"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.KOTA ? true : false}
                      errorMessage = {formik.errors.KOTA ? formik.errors.KOTA : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Kode Pos"
                      radius="sm"
                      type="number"
                      name="KODEPOS"
                      value={formik.values.KODEPOS}
                      placeholder="Enter kode pos"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.KODEPOS ? true : false}
                      errorMessage = {formik.errors.KODEPOS ? formik.errors.KODEPOS : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Email"
                      radius="sm"
                      name="EMAIL2"
                      type="email"
                      value={formik.values.EMAIL2}
                      placeholder="Enter email"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.EMAIL2 ? true : false}
                      errorMessage = {formik.errors.EMAIL2 ? formik.errors.EMAIL2 : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Telephone"
                      radius="sm"
                      name="TELP"
                      value={formik.values.TELP}
                      placeholder="Enter telephone"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.TELP ? true : false}
                      errorMessage = {formik.errors.TELP ? formik.errors.TELP : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="No. HP"
                      radius="sm"
                      name="NOHP"
                      value={formik.values.NOHP}
                      placeholder="Enter no hp"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.NOHP ? true : false}
                      errorMessage = {formik.errors.NOHP ? formik.errors.NOHP : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="No. HP 2"
                      radius="sm"
                      name="NOHP2"
                      value={formik.values.NOHP2}
                      placeholder="Enter no hp 2"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.NOHP2 ? true : false}
                      errorMessage = {formik.errors.NOHP2 ? formik.errors.NOHP2 : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Status Tempat Tinggal"
                      radius="sm"
                      name="STATUS_TEMPAT"
                      value={formik.values.STATUS_TEMPAT}
                      placeholder="Enter status tempat tinggal"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.STATUS_TEMPAT ? true : false}
                      errorMessage = {formik.errors.STATUS_TEMPAT ? formik.errors.STATUS_TEMPAT : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Lama Tinggal"
                      radius="sm"
                      name="LAMA_TINGGAL"
                      value={formik.values.LAMA_TINGGAL}
                      placeholder="Enter lama tinggal"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.LAMA_TINGGAL ? true : false}
                      errorMessage = {formik.errors.LAMA_TINGGAL ? formik.errors.LAMA_TINGGAL : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Status Pernikahan"
                      radius="sm"
                      name="STATUS_PERNIKAHAN"
                      value={formik.values.STATUS_PERNIKAHAN}
                      placeholder="Enter status pernikahan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.STATUS_PERNIKAHAN ? true : false}
                      errorMessage = {formik.errors.STATUS_PERNIKAHAN ? formik.errors.STATUS_PERNIKAHAN : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Jumlah Tanggungan"
                      radius="sm"
                      name="JUMLAH_TANGUNGAN"
                      value={formik.values.JUMLAH_TANGUNGAN}
                      placeholder="Enter jumlah tanggungan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.JUMLAH_TANGUNGAN ? true : false}
                      errorMessage = {formik.errors.JUMLAH_TANGUNGAN ? formik.errors.JUMLAH_TANGUNGAN : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Pendidikan Terakhir"
                      radius="sm"
                      name="PENDIDIKAN_TERAKHIR"
                      value={formik.values.PENDIDIKAN_TERAKHIR}
                      placeholder="Enter pendidikan terakhir"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.PENDIDIKAN_TERAKHIR ? true : false}
                      errorMessage = {formik.errors.PENDIDIKAN_TERAKHIR ? formik.errors.PENDIDIKAN_TERAKHIR : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Nama Ibu Kandung"
                      radius="sm"
                      name="NAMA_IBUKANDUNG"
                      value={formik.values.NAMA_IBUKANDUNG}
                      placeholder="Enter nama ibu kandung"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.NAMA_IBUKANDUNG ? true : false}
                      errorMessage = {formik.errors.NAMA_IBUKANDUNG ? formik.errors.NAMA_IBUKANDUNG : ''}
                  /> 
                  <NextSelect
                    labelPlacement="outside"
                    label="Status Pelanggan"
                    name="STATUS_PELANGGAN"
                    variant="bordered"
                    radius="sm"
                    placeholder="Select a status pelanggan"
                    value={formik.values.STATUS_PELANGGAN}
                    onChange={handleChangeInput}
                    selectedKeys={[formik.values.STATUS_PELANGGAN]}
                    className="bg-transparent drop-shadow-sm  rounded-md"
                  >
                    {statusPelanggan.map(sp => (
                      <SelectItem key={sp.value?.toString()}>
                        {sp.label}
                      </SelectItem>
                    ))}
                  </NextSelect>
                  <NextSelect
                    labelPlacement="outside"
                    label="Status Order"
                    name="STATUS_ORDER"
                    variant="bordered"
                    radius="sm"
                    placeholder="Select a status order"
                    value={formik.values.STATUS_ORDER}
                    onChange={handleChangeInput}
                    selectedKeys={[formik.values.STATUS_ORDER]}
                    className="bg-transparent drop-shadow-sm  rounded-md"
                  >
                    {statusOrder.map(sp => (
                      <SelectItem key={sp.value?.toString()}>
                        {sp.label}
                      </SelectItem>
                    ))}
                  </NextSelect>
                </div>
              </Tab>
              <Tab key="informasi-lain" title="Informasi Lain">
                <h3 className={`text-sm mt-1 ml-1 font-semibold`}>Keluarga Tidak Serumah Yang Dapat Dihubungi</h3>
                <Divider className="my-3" />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Nama Lengkap"
                      radius="sm"
                      name="NAMA_LENGKAP2"
                      value={formik.values.NAMA_LENGKAP2}
                      placeholder="Enter nama lengkap"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.NAMA_LENGKAP2 ? true : false}
                      errorMessage = {formik.errors.NAMA_LENGKAP2 ? formik.errors.NAMA_LENGKAP2 : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Hubungan"
                      radius="sm"
                      name="HUBUNGAN"
                      value={formik.values.HUBUNGAN}
                      placeholder="Enter hubungan"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.HUBUNGAN ? true : false}
                      errorMessage = {formik.errors.HUBUNGAN ? formik.errors.HUBUNGAN : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Telephone"
                      radius="sm"
                      name="TELP2"
                      value={formik.values.TELP2}
                      placeholder="Enter telephone"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.TELP2 ? true : false}
                      errorMessage = {formik.errors.TELP2 ? formik.errors.TELP2 : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="No. HP"
                      radius="sm"
                      name="HANDPHONE"
                      value={formik.values.HANDPHONE}
                      placeholder="Enter no hp"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.HANDPHONE ? true : false}
                      errorMessage = {formik.errors.HANDPHONE ? formik.errors.HANDPHONE : ''}
                  /> 
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                    <Textarea
                      className=""
                      label="Alamat"
                      name="ALAMAT2"
                      labelPlacement="outside"
                      placeholder="Enter alamat"
                      variant="bordered"
                      value={formik.values.ALAMAT2}
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.ALAMAT2 ? true : false}
                      errorMessage = {formik.errors.ALAMAT2 ? formik.errors.ALAMAT2 : ''}
                    />
                </div>   
                <div className="grid grid-cols-2 gap-4 mt-4"> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="RT"
                      radius="sm"
                      name="RT2"
                      value={formik.values.RT2}
                      placeholder="Enter rt"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.RT2 ? true : false}
                      errorMessage = {formik.errors.RT2 ? formik.errors.RT2 : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="RW"
                      radius="sm"
                      name="RW2"
                      value={formik.values.RW2}
                      placeholder="Enter rw"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.RW2 ? true : false}
                      errorMessage = {formik.errors.RW2 ? formik.errors.RW2 : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Kota"
                      radius="sm"
                      name="KOTA2"
                      value={formik.values.KOTA2}
                      placeholder="Enter kota"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.KOTA2 ? true : false}
                      errorMessage = {formik.errors.KOTA2 ? formik.errors.KOTA2 : ''}
                  /> 
                  <Input
                      autoFocus
                      labelPlacement="outside"
                      label="Kode Pos"
                      radius="sm"
                      name="KODEPOS2"
                      type="number"
                      value={formik.values.KODEPOS2}
                      placeholder="Enter kode pos"
                      variant="bordered"
                      onChange={handleChangeInput}
                      isInvalid = {formik.errors.KODEPOS2 ? true : false}
                      errorMessage = {formik.errors.KODEPOS2 ? formik.errors.KODEPOS2 : ''}
                  /> 
                </div>
              </Tab>
              <Tab key="informasi-foto" title="Informasi Foto">
                <div className="grid grid-cols-2 gap-4">
                  <section className="container">
                    <div>
                      <label className="text-[#020617] text-sm">Foto KTP</label>
                    </div>
                    <div className="flex-1 items-center max-w-screen-sm mx-auto mb-3 space-y-4 sm:flex sm:space-y-0 mt-1">
                      <div className="relative w-full">
                        {/* Ensure that the spread props are applied correctly here */}
                        <div {...dropzone1.getRootProps({ className: 'dropzone' })} className="items-center justify-center max-w-xl mx-auto">
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
                            <input {...dropzone1.getInputProps()} type="file" name="file_upload" className="hidden" accept="image/png,image/jpeg" id="input" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                  <div>
                    <label className="text-[#020617] text-sm">Preview Foto KTP</label>
                    {imagePreview}
                  </div>
                  <section className="container">
                    <div>
                      <label className="text-[#020617] text-sm">Foto Selfie</label>
                    </div>
                    <div className="flex-1 items-center max-w-screen-sm mx-auto mb-3 space-y-4 sm:flex sm:space-y-0 mt-1">
                      <div className="relative w-full">
                        {/* Ensure that the spread props are applied correctly here */}
                        <div {...dropzone2.getRootProps({ className: 'dropzone' })} className="items-center justify-center max-w-xl mx-auto">
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
                            <input {...dropzone2.getInputProps()} type="file" name="file_upload" className="hidden" accept="image/png,image/jpeg" id="input" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                  <div>
                    <label className="text-[#020617] text-sm">Preview Foto Selfie</label>
                    {imagePreview2}
                  </div>
                </div>
              </Tab>
            </Tabs>
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
