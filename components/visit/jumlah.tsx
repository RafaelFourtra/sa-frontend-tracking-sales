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
  Form,
  DateRangePicker,
  useDisclosure,
  DateValue
} from "@heroui/react";
import React from "react";
import { useState, useEffect } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { BsFileEarmarkPdf, BsFileEarmarkExcel } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "../breadcrumb/breadcrumb";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select';
import Cookies from "js-cookie";
import { useAuthorization } from "@/context/AuthorizationContext";
import ForbiddenError from "../error/403";
import { DateTime } from 'luxon';
import { jsPDF }  from "jspdf";
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
  TANGGAL: {
    start: string;
    end: string;
  };
  TANGGALVIEW: {
    start: DateValue | null;
    end: DateValue | null;
  };
};

interface GroupedVisit {
  NAME: string;
  JUMLAH: number;
}

export const Visit = () => {
  const router = useRouter();
  const token = Cookies.get("auth_token");
  const [isLoading, setIsLoading] = useState(true);
  const [visit, setVisit] = useState<Visit[]>([]);
  const [user, setUser] = useState([]);
  const { userLogin, checkPermission } = useAuthorization()
  const [access, setAccess] = useState(null)
  const [filteredPelanggan, setFilteredPelanggan] = useState([]);
  


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
      const permissionGranted = await checkPermission("visit.jumlah.read");
      setAccess(permissionGranted);
    }
    fetchPermission()

  }, []);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Visit" },
    { label: "Jumlah Per Sales" },
  ];


  const [formValues, setFormValues] = useState<FormValues>({
    SALES: "",
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

      const matchesTanggal =
        formValues.TANGGAL.start && formValues.TANGGAL.end
          ? new Date(rm.TANGGAL) >= new Date(formValues.TANGGAL.start) &&
          new Date(rm.TANGGAL) <= new Date(formValues.TANGGAL.end)
          : true;

      return matchesSales && matchesTanggal;
    });
  }, [visit, formValues]);

  const visitsGroupedByUser = React.useMemo(() => {
    const grouped = filteredVisit.reduce((acc, rm) => {
      const userId = rm.User.ID;  
      if (!acc[userId]) {
        acc[userId] = {
          NAME: rm.User.NAME,
          JUMLAH: 0
        };
      }
      acc[userId].JUMLAH += 1; 
      return acc;
    }, {} as Record<string, GroupedVisit>);
    
    return Object.values(grouped);
  }, [filteredVisit]);

  const pages =
    filteredVisit.length > 0
      ? Math.ceil(filteredVisit.length / rowsPerPage)
      : 1;

  const shortingRow = React.useMemo(() => {
    const data = [...visitsGroupedByUser];
    const { column, direction } = sortDescriptor;

    data.sort((a, b): any => {
      if (a[column as keyof typeof a] < b[column as keyof typeof a])
        return direction == "ascending" ? -1 : 1;
      if (a[column as keyof typeof a] > b[column as keyof typeof a])
        return direction == "ascending" ? 1 : -1;
    });

    return data;
  }, [visitsGroupedByUser, sortDescriptor]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return shortingRow.slice(start, end);
  }, [page, shortingRow]);


  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Jumlah Visit Per Sales');
  
    const title = 'Laporan Jumlah Visit Per Sales';
    worksheet.mergeCells('A1:B1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = title;
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
  
    const customHeaders = [
      { header: 'Sales', key: 'NAME', width: 25 },
      { header: 'Jumlah Visit', key: 'JUMLAH', width: 15 },
    ];
    worksheet.columns = customHeaders;
  
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
  
    visitsGroupedByUser.forEach((data) => {
      worksheet.addRow({
        NAME: data.NAME,
        JUMLAH: data.JUMLAH,
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
      saveAs(new Blob([buffer]), 'jumlah_visit_data.xlsx');
    });
  };
  
  

  const exportToPdf = () => {
    const doc = new jsPDF();
  
    const title = 'Laporan Jumlah Visit Per Sales';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(2, 6, 23);
    
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;
    
    doc.text(title, xPosition, 20);
  
    const customHeaders = ['Nama Pengguna', 'Jumlah Kunjungan'];
  
    const tableData = visitsGroupedByUser.map((visit) => [visit.NAME, visit.JUMLAH]);
  
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
  
    doc.save('jumlah_visit_data.pdf');
  };

  const resetForm = () => {
    setFormValues({
        SALES: "",
        TANGGAL: { start: "", end: "" },
        TANGGALVIEW: { start: null, end: null },
    });
  };


  const handleSelectChange = (selectedOption, { name }) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: selectedOption ? selectedOption.value : '',
    }));
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
        <h3 className="text-xl font-semibold">Jumlah Visit Per Sales</h3>
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
            <TableColumn key="JUMLAH" allowsSorting>
              JUMLAH VISIT
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={"No rows to display."}
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
            items={items}
          >
            {items.map((item, index) => (
              <TableRow key={index}>
                {(columnKey) => {
                  let cellContent;

                  switch (columnKey) {
                    case "User.NAME":
                      cellContent = item.NAME;
                      break;
                    case "JUMLAH":
                      cellContent = item.JUMLAH;
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
    </div>
  );
};
