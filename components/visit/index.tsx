"use client";
import {
  Button,
  Input,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Tooltip,
  Form,
  DateRangePicker,
  Avatar,
  Chip,
  Modal,
  ModalContent,
  useDisclosure,
  Image,
  DateValue
} from "@heroui/react";
import React from "react";
import { useState, useEffect } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { BsFileEarmarkPdf, BsFileEarmarkExcel } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "../breadcrumb/breadcrumb";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select';
import swal from "sweetalert";
import Cookies from "js-cookie";
import { useAuthorization } from "@/context/AuthorizationContext";
import ForbiddenError from "../error/403";
import { DateTime } from 'luxon';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


interface User {
  ID: string;
  NAME: string;
}

interface Pelanggan {
  ID: string;
  NAME: string;
  PERSONNO: string;
}

interface Visit {
  ID: string;
  User: User;
  Pelanggan: Pelanggan
  TANGGAL: string;
  CHECKIN: string;
  IMAGE_IN: string;
  CHECKOUT: string;
  IMAGE_OUT: string;
  DURASI: string;
  STATUS: string;
  KETERANGAN: string;
  IMAGE_IN_URL: string;
  IMAGE_OUT_URL: string;
}

type SortDirection = "ascending" | "descending";

interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

type FormValues = {
  SALES: string;
  PELANGGAN: string;
  KETERANGAN: string;
  STATUS: string;
  TANGGAL: {
    start: string;
    end: string;
  };
  TANGGALVIEW: {
    start: DateValue | null;
    end: DateValue | null;
  };
};

export const Visit = () => {
  const router = useRouter();
  const token = Cookies.get("auth_token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [visit, setVisit] = useState<Visit[]>([]);
  const [user, setUser] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);
  const [filteredPelanggan, setFilteredPelanggan] = useState([]);
  const [imageView, setImageView] = useState(null);
  const { userLogin, checkPermission } = useAuthorization()
  const [access, setAccess] = useState(null)


  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_VISIT_DATATABLE_URL_API}`,
        {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.status == 200) {
        setVisit(result.data || []);
      } else if (result.status == 403 || result.status == 401) {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 4000,
          pauseOnHover: true,
          transition: Bounce,
        });
      }

      const responseUser = await fetch(
        `${process.env.NEXT_PUBLIC_USER_DATATABLE_URL_API}`,
        {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const dataUser = await responseUser.json()
      if (dataUser.status && dataUser.status == 200) {
        const formattedUser = dataUser.data.map((user: any) => ({
          label: user.NAME,
          value: user.NAME
        }));
        setUser(formattedUser || [])
      }

      const responsePelanggan = await fetch(
        `${process.env.NEXT_PUBLIC_PELANGGAN_DATATABLE_URL_API}`,
        {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const dataPelanggan = await responsePelanggan.json()
      if (dataPelanggan.status && dataPelanggan.status == 200) {
        const formattedPelanggan = dataPelanggan.data.map((pelanggan: any) => ({
          label: pelanggan.NAME,
          value: pelanggan.NAME
        }));
        setPelanggan(formattedPelanggan || [])
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setVisit([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    fetchData();
    const fetchPermission = async () => {
      const permissionGranted = await checkPermission("visit.read");
      setAccess(permissionGranted);
    }
    fetchPermission()

  }, []);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Visit" },
    { label: "List" },
  ];

  const keterangan = [
    { label: "Order", value: "Order" },
    { label: "Tagih", value: "Tagih" },
    { label: "Order-Tagih", value: "Order-Tagih" },
    { label: "Lainnya", value: "Lainnya" },
  ];

  const status = [
    { label: "Normal", value: "Normal" },
    { label: "Checkout Luar", value: "Checkout Luar" },
  ]

  const [formValues, setFormValues] = useState<FormValues>({
    SALES: "",
    PELANGGAN: "",
    KETERANGAN: "",
    STATUS: "",
    TANGGAL: { start: "", end: "" },
    TANGGALVIEW: { start: null, end: null },
  });
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "",
    direction: "ascending",
  });

  const rowsPerPage = 15;

  const handleSort = (columnKey: any) => {
    setSortDescriptor({
      column: columnKey.column,
      direction: columnKey.direction,
    });
  };

  const filteredVisit = React.useMemo(() => {
    return visit.filter((rm) => {
      const matchesSales = formValues.SALES
        ? rm.User.NAME === formValues.SALES
        : true;

      const matchesPelanggan = formValues.PELANGGAN
        ? rm.Pelanggan.NAME === formValues.PELANGGAN
        : true;

      const matchesKeterangan = formValues.KETERANGAN
        ? rm.KETERANGAN === formValues.KETERANGAN
        : true;

      const matchesStatus = formValues.STATUS
        ? rm.STATUS === formValues.STATUS
        : true;

      const matchesTanggal =
        formValues.TANGGAL.start && formValues.TANGGAL.end
          ? new Date(rm.TANGGAL) >= new Date(formValues.TANGGAL.start) &&
          new Date(rm.TANGGAL) <= new Date(formValues.TANGGAL.end)
          : true;

      return matchesSales && matchesPelanggan && matchesKeterangan && matchesStatus && matchesTanggal;
    });
  }, [visit, formValues]);

  const pages =
    filteredVisit.length > 0
      ? Math.ceil(filteredVisit.length / rowsPerPage)
      : 1;

  const shortingRow = React.useMemo(() => {
    const data = [...filteredVisit];
    const { column, direction } = sortDescriptor;

    data.sort((a, b): any => {
      if (a[column as keyof typeof a] < b[column as keyof typeof a])
        return direction == "ascending" ? -1 : 1;
      if (a[column as keyof typeof a] > b[column as keyof typeof a])
        return direction == "ascending" ? 1 : -1;
    });

    return data;
  }, [filteredVisit, sortDescriptor]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return shortingRow.slice(start, end);
  }, [page, shortingRow]);


  const resetForm = () => {
    setFormValues({
      SALES: "",
      PELANGGAN: "",
      KETERANGAN: "",
      STATUS: "",
      TANGGAL: { start: "", end: "" },
      TANGGALVIEW: { start: null, end: null },
    });
  };

  const handleDelete = (id: any) => {

    swal({
      title: "Apakah Anda yakin?",
      text: "Data akan dihapus. Apakah Anda ingin melanjutkan?",
      icon: "warning",
      buttons: ["Cancel", "OK"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        if (navigator.onLine) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_VISIT_DELETE_URL_API}${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${token}`,
            }
          })
          const result = await response.json()
          if (result.status && result.message) {
            if (result.status == 200) {
              toast.success(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });

              fetchData()
            } else {
              toast.error(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
            }
          } else {
            toast.error('Terjadi kesalahan pada sistem !', {
              position: "top-right",
              autoClose: 4000,
              pauseOnHover: true,
              transition: Bounce,
            });
          }
        } else {
          toast.error("Koneksi gagal. Periksa jaringan Anda dan coba lagi.", {
            position: "top-right",
            autoClose: 4000,
            pauseOnHover: true,
            transition: Bounce,
          });
        }
      } else {
      }
    });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleInputChange = (value) => {
    if (value.trim().length > 0) {
      const filtered = pelanggan.filter((option) =>
        option.label?.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 200);
      setFilteredPelanggan(filtered);
    } else {
      setFilteredPelanggan([]);
    }
  };

  const handleDateChange = (value: any) => {
    const startDate = value.start ? DateTime.fromObject({
      year: value.start.year,
      month: value.start.month,
      day: value.start.day,
    }).toISODate() : null;

    const endDate = value.end ? DateTime.fromObject({
      year: value.end.year,
      month: value.end.month,
      day: value.end.day,
    }).toISODate() : null;

    setFormValues({
      ...formValues,
      TANGGAL: { start: startDate, end: endDate },
      TANGGALVIEW: value,
    });
  };

  const viewImage = (image) => {
    setImageView(image)
    onOpen()
  }

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Jumlah Visit Per Sales');
    
    // Definisikan columns terlebih dahulu
    const customHeaders = [
      { header: 'Sales', key: 'NAME', width: 25 },
      { header: 'Kode Pelanggan', key: 'PERSONNO', width: 15 },
      { header: 'Pelanggan', key: 'PELANGGANNAME', width: 15 },
      { header: 'Tanggal', key: 'TANGGAL', width: 15 },
      { header: 'Check In', key: 'CHECKIN', width: 15 },
      { header: 'Check Out', key: 'CHECKOUT', width: 15 },
      { header: 'Durasi', key: 'DURASI', width: 15 },
      { header: 'Keterangan', key: 'KETERANGAN', width: 15 },
      { header: 'Status', key: 'STATUS', width: 15 },
    ];
    worksheet.columns = customHeaders;
    
    // Tambahkan baris kosong untuk title
    worksheet.spliceRows(1, 0, []);
    
    // Sekarang tambahkan title
    worksheet.mergeCells('A1:I1');
    worksheet.getRow(1).height = 30;
    
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Laporan Rekap Visit';
    titleCell.font = {
      name: 'Arial',
      bold: true,
      size: 13,
      color: { argb: 'FFFFFF' },
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '020617' },
    };
    titleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    const headerRow = worksheet.getRow(2);
    headerRow.values = customHeaders.map((header) => header.header);
    
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4F81BD' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
    });

    visit.forEach((data) => {
      worksheet.addRow({
        NAME: data.User.NAME,
        PERSONNO: data.Pelanggan.PERSONNO,
        PELANGGANNAME: data.Pelanggan.NAME,
        TANGGAL: data.TANGGAL,
        CHECKIN: data.CHECKIN,
        CHECKOUT: data.CHECKOUT,
        DURASI: data.DURASI,
        KETERANGAN: data.KETERANGAN,
        STATUS: data.STATUS,
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (rowNumber > 2) {
          cell.font = { size: 11 };
        }
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), 'visit_rekap_data.xlsx');
    });
};
  
  

  const exportToPdf = () => {
    const doc = new jsPDF();
  
    const title = 'Laporan Rekap Visit';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(2, 6, 23);
    
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;
    
    doc.text(title, xPosition, 20);
  
    const customHeaders = ['Sales', 'Kode Pelanggan', 'Pelanggan', 'Tanggal', 'Check In', 'Check Out', 'Durasi', 'Keterangan', 'Status'];
  
    const tableData = visit.map((visit) => [
          visit.User.NAME, 
          visit.Pelanggan.PERSONNO, 
          visit.Pelanggan.NAME,
          visit.TANGGAL,
          visit.CHECKIN,
          visit.CHECKOUT,
          visit.DURASI,
          visit.KETERANGAN,
          visit.STATUS,
        ]);
  
    doc.autoTable({
      head: [customHeaders],
      body: tableData,
      startY: 30,
      headStyles: {
        fillColor: [79, 129, 189], 
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 'auto' }, 
        1: { cellWidth: 'auto' }, 
      },
      styles: {
        fontSize: 11, 
        cellPadding: 1, 
        halign: 'center', 
        valign: 'middle', 
        lineColor: [0, 0, 0], 
        lineWidth: 0.2, 
      },
      margin: { top: 20 },
    });
  
    doc.save('visit_rekap_data.pdf');
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
      <Card className="max-full">
        <CardBody>
          <Form>
            <div className="md:flex flex-row gap-3.5 flex-wrap mt-3 mb-5">
              <div className="mt-3.5 lg:-mt-1">
                <DateRangePicker
                  showMonthAndYearPickers
                  classNames={{
                    inputWrapper: "mt-0.5",
                  }}
                  value={formValues.TANGGALVIEW}
                  onChange={handleDateChange}
                  labelPlacement="outside"
                  label="Rentang Tanggal"
                  variant="bordered"
                />
              </div>
              <div>
                <h3 className="text-sm mt-3.5 lg:-mt-1">Sales</h3>
                <Select
                  className="text-sm basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a sales"
                  isDisabled={false}
                  isLoading={false}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="SALES"
                  value={user.find(option => option.value === formValues.SALES) || null}
                  options={user}
                  onChange={handleSelectChange}
                  styles={{
                    control: (base: any) => ({
                      ...base,
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                      borderRadius: '8px',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '220px',
                    }),
                    menu: (base: any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null} />
              </div>
              <div>
                <h3 className="text-sm mt-3.5 lg:-mt-1">Pelanggan</h3>
                <Select
                  className="text-sm basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a pelanggan"
                  isDisabled={false}
                  isLoading={false}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="PELANGGAN"
                  value={pelanggan.find(option => option.value === formValues.PELANGGAN) || null}
                  options={filteredPelanggan}
                  onInputChange={(value) => handleInputChange(value)}
                  onChange={handleSelectChange}
                  styles={{
                    control: (base: any) => ({
                      ...base,
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                      borderRadius: '8px',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '220px',
                    }),
                    menu: (base: any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null} />
              </div>
              <div>
                <h3 className="text-sm mt-3.5 lg:-mt-1">Keterangan</h3>
                <Select
                  className="text-sm basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a keterangan"
                  isDisabled={false}
                  isLoading={false}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="KETERANGAN"
                  value={keterangan.find(option => option.value === formValues.KETERANGAN) || null}
                  options={keterangan}
                  onChange={handleSelectChange}
                  styles={{
                    control: (base: any) => ({
                      ...base,
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                      borderRadius: '8px',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '220px',
                    }),
                    menu: (base: any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null} />
              </div>
            </div>
            <div className="flex flex-row gap-3.5 flex-wrap mb-5">
              <div>
                <h3 className="text-sm -mt-3.5 lg:-mt-3">Status</h3>
                <Select
                  className="text-sm basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a status"
                  isDisabled={false}
                  isLoading={false}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="STATUS"
                  value={status.find(option => option.value === formValues.STATUS) || null}
                  options={status}
                  onChange={handleSelectChange}
                  styles={{
                    control: (base: any) => ({
                      ...base,
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                      borderRadius: '8px',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '220px',
                    }),
                    menu: (base: any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null} />
              </div>
              <Button
                size="sm"
                color="warning"
                title="Reset Filter"
                className="ml-1 p-3 md:mt-5 mt-4 bg-[#ffde08] min-w-0 flex items-center justify-center"
                onPress={resetForm}
              >
                <VscDebugRestart className="text-lg text-white" />
              </Button>
            </div>
          </Form>
        </CardBody>
        {/* <CardFooter>
        </CardFooter> */}
      </Card>

      {/* <Divider /> */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">All Visit</h3>
        <div className="flex flex-row gap-1 flex-wrap">
          <Button
            size="sm"
            color="primary"
            onPress={exportToExcel}
            startContent={<BsFileEarmarkExcel />}
          >
            Excel
          </Button>
          <Button
            size="sm"
            color="primary"
            onPress={exportToPdf}
            startContent={<BsFileEarmarkPdf />}
          >
            PDF
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <Table
          onSortChange={handleSort}
          sortDescriptor={sortDescriptor}
          isStriped={true}
          aria-label="Example table with client side pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                classNames={{
                  cursor: "bg-[#020617]",
                }}
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="no">NO</TableColumn>
            <TableColumn key="User.NAME" allowsSorting>
              SALES
            </TableColumn>
            <TableColumn key="Pelanggan.PERSONNO" allowsSorting>
              NO. PELANGGAN
            </TableColumn>
            <TableColumn key="Pelanggan.NAME" allowsSorting>
              PELANGGAN
            </TableColumn>
            <TableColumn key="TANGGAL" allowsSorting>
              TANGGAL
            </TableColumn>
            <TableColumn key="CHECKIN" allowsSorting>
              CHECK IN
            </TableColumn>
            <TableColumn key="CHECKOUT" allowsSorting>
              CHECK OUT
            </TableColumn>
            <TableColumn key="IMAGE_IN">
              IMAGE IN
            </TableColumn>
            <TableColumn key="IMAGE_OUT">
              IMAGE OUT
            </TableColumn>
            <TableColumn key="DURASI" allowsSorting>
              DURASI
            </TableColumn>
            <TableColumn key="KETERANGAN" allowsSorting>
              KETERANGAN
            </TableColumn>
            <TableColumn key="STATUS" allowsSorting>
              STATUS
            </TableColumn>
            <TableColumn key="action">ACTION</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={"No rows to display."}
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
            items={items}
          >
            {items.map((item, index) => (
              <TableRow key={item.ID}>
                {(columnKey) => {
                  let cellContent;

                  switch (columnKey) {
                    case "User.NAME":
                      cellContent = item.User?.NAME;
                      break;
                    case "Pelanggan.PERSONNO":
                      cellContent = item.Pelanggan?.PERSONNO;
                      break;
                    case "Pelanggan.NAME":
                      cellContent = item.Pelanggan?.NAME;
                      break;
                    case "TANGGAL":
                      cellContent = item.TANGGAL;
                      break;
                    case "CHECKIN":
                      cellContent = item.CHECKIN;
                      break;

                    case "CHECKOUT":
                      cellContent = item.CHECKOUT;
                      break;
                    case "IMAGE_IN":
                      cellContent = item.IMAGE_IN ? (
                        <Avatar
                          radius="sm"
                          className="w-20 h-20 text-large"
                          src={`${item.IMAGE_IN_URL}?token=${token}`}
                          onClick={() => viewImage(`${item.IMAGE_IN_URL}?token=${token}`)}
                        />
                      ) : (
                        <span>-</span>
                      );
                      break;
                    case "IMAGE_OUT":
                      cellContent = item.IMAGE_OUT ? (
                        <Avatar
                          radius="sm"
                          className="w-20 h-20 text-large"
                          src={`${item.IMAGE_OUT_URL}?token=${token}`}
                          onClick={() => viewImage(`${item.IMAGE_OUT_URL}?token=${token}`)}
                        />
                      ) : (
                        <span>-</span>
                      );
                      break;
                    case "DURASI":
                      cellContent = item.DURASI;
                      break;
                    case "STATUS":
                      let stats = <Chip color="default">{item.STATUS}</Chip>;
                      if (item.STATUS == "Normal") {
                        stats = <Chip color="warning" className="text-white">{item.STATUS}</Chip>;
                      } else if (item.STATUS == "Checkout Luar") {
                        stats = <Chip color="danger" className="text-white">{item.STATUS}</Chip>;
                      }

                      cellContent = stats
                      break;
                    case "KETERANGAN":
                      cellContent = item.KETERANGAN
                      break;

                    case "action":
                      cellContent = (
                        <div className="flex items-center gap-4">
                          <div>
                            <Tooltip content="Details">
                              <button
                                onClick={() => router.push(
                                  `/visit/detail/${item.ID}`
                                )}
                              >
                                <EyeIcon size={20} fill="#979797" />
                              </button>
                            </Tooltip>
                          </div>
                          <div>
                            <Tooltip
                              content="Delete"
                              color="danger"
                            >
                              <button onClick={() => handleDelete(item.ID)}>
                                <DeleteIcon size={20} fill="#FF0080" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      );
                      break;
                    default:
                      cellContent = index + 1;
                      break;
                  }

                  return <TableCell>{cellContent}</TableCell>;
                }}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
