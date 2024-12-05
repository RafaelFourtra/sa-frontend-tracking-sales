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
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Image
} from "@nextui-org/react";
import React from "react";
import { useState, useEffect } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EditIcon } from "../../icons/table/edit-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "../../breadcrumb/breadcrumb";
import { toast, ToastContainer, Bounce  } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Select from 'react-select';


interface City {
  id: number;
  city: string;
}

interface User {
  id: number;
  name: string;
}

interface OutletDetail {
  pjSales: User
}

interface Outlet {
  id: number;
  codeOutlet: string;
  outlet: string;
  city: City;
  address: string;
  area: string;
  outletManager: User;
  outletDetail: OutletDetail;
  longitude: string;
  latitude: string;
  imageQr: string;
}

type SortDirection = "ascending" | "descending";

interface SortDescriptor {
  column: string;
  direction: SortDirection; 
}

export const Outlet = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [outlet, setOutlet] = useState<Outlet[]>([]);
  const [user, setUser] = useState([]);
  const [city, setCity] = useState([]);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [imagePreviewQr, setImagePreviewQr] = useState(null);

  const fetchData = async () => {
    try {
      NProgress.set(0.4);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_OUTLET_DATATABLE_URL_API}`,
        { cache: "no-store" }
      );
      const data = await response.json();
      setOutlet(data.data || []);

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

    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setOutlet([]);
    } finally {
      setIsLoading(false);
      NProgress.done();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const breadcrumbItems = [
    { label: "Home" },
    { label: "Master" },
    { label: "Outlet" },
    { label: "List" },
  ];

  const [formValues, setFormValues] = useState({
    codeOutlet: "",
    outlet: "",
    city: "",
    address: "",
    area: "",
    manager: "",
    pjsales: "",
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

  const filteredOutlet = React.useMemo(() => {
    return outlet.filter((outlet) => {
      const matchesCodeOutlet = formValues.codeOutlet
        ? outlet.codeOutlet
            .toLowerCase()
            .includes(formValues.codeOutlet.toLowerCase())
        : true;
      const matchesOutlet = formValues.outlet
        ? outlet.outlet
            .toLowerCase()
            .includes(formValues.outlet.toLowerCase())
        : true;
        
      const matchesCity = formValues.city
        ? outlet.cityId.toString() === formValues.city.toString() 
        : true;
      const matchesAddress = formValues.address
        ? outlet.address
            .toLowerCase()
            .includes(formValues.address.toLowerCase())
        : true;
      const matchesArea = formValues.area
        ? outlet.area
            .toLowerCase()
            .includes(formValues.area.toLowerCase())
        : true;
      const matchesManager = formValues.manager
        ? outlet.outletManager.id.toString() === formValues.manager.toString()
        : true;
      const matchesPjSales = formValues.pjsales
        ? outlet.outletDetail.some(pj => {
          return pj.pjSalesId.toString() === formValues.pjsales.toString()
        }) 
        : true;
      return matchesCodeOutlet && matchesOutlet && matchesCity && matchesAddress && matchesArea && matchesManager && matchesPjSales;
    });
  }, [outlet, formValues]);

  const pages = filteredOutlet.length > 0 ? Math.ceil(filteredOutlet.length / rowsPerPage) : 1;

 const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

    const shortingRow = React.useMemo(() => {
    const data = [...filteredOutlet];
    const { column, direction } = sortDescriptor;

   
    data.sort((a, b): any => {
      const aValue = getNestedValue(a, column);
      const bValue = getNestedValue(b, column);
  
      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
    });

    return data;
  }, [filteredOutlet, sortDescriptor]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return shortingRow.slice(start, end);
  }, [page, shortingRow]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        [name]: value,
      };
      return updatedValues;
    });
  };

  const handleSelectChange = (selectedOption, {name}) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: selectedOption ? selectedOption.value : '',
    }));
  };

  const resetForm = () => {
    setFormValues({
      codeOutlet: "",
      outlet: "",
      city: "",
      address: "",
      area: "",
      manager: "",
      pjsales: "",
    });
  };

  const handleOpen = (imageQr) => {
    onOpen();
    setImagePreviewQr(imageQr)
  }

  const handleDelete = (id :any) => {
    swal({
      title: "Apakah Anda yakin?",
      text: "Data akan dihapus. Apakah Anda ingin melanjutkan?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        if (navigator.onLine) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_OUTLET_DELETE_URL_API}${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          })
          const result = await response.json()
          if(result.message) {
            if(result.status == 200){ 
              toast.success(result.message, {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
              
              fetchData()
            } else {
              console.log("s")
              toast.error('Terjadi kesalahan pada sistem !', {
                position: "top-right",
                autoClose: 4000,
                pauseOnHover: true,
                transition: Bounce,
              });
            }
          } else {
            console.log("ss")
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
  

  return (
    <div className="px-4 lg:px-6 max-w-[95rem] bg-[#F5F6F8] mx-auto w-full h-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <ToastContainer/>
      <Card className="max-full">
        <CardBody>
          <form>
            <div className="md:flex flex-row gap-3.5 flex-wrap mt-3 mb-5">
              <Input
                type="text"
                labelPlacement="outside"
                label="Outlet Code"
                name="codeOutlet"
                placeholder="Enter outlet code"
                color="default"
                radius="sm"
                variant="bordered"
                className={`bg-transparent max-w-[220px] drop-shadow-sm rounded-md`}
                value={formValues.codeOutlet}
                onChange={handleChange}
              />
              <Input
                type="text"
                labelPlacement="outside"
                label="Outlet"
                name="outlet"
                placeholder="Enter outlet"
                color="default"
                radius="sm"
                variant="bordered"
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
                value={formValues.outlet}
                onChange={handleChange}
              />
              <div>
                <h3 className="text-sm -mt-1">City</h3>
               <Select
                  className="basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a city"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="city"
                  value={city.find(option => option.value === formValues.city) || null} 
                  options={city}
                  onChange={handleSelectChange}
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderColor: 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '220px',
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
              <Input
                type="text"
                labelPlacement="outside"
                label="Address"
                name="address"
                placeholder="Enter address"
                color="default"
                radius="sm"
                variant="bordered"
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
                value={formValues.address}
                onChange={handleChange}
              />
              <Input
                type="text"
                labelPlacement="outside"
                label="Area"
                name="area"
                placeholder="Enter area"
                color="default"
                radius="sm"
                variant="bordered"
                className="bg-transparent max-w-[220px] drop-shadow-sm  rounded-md"
                value={formValues.area}
                onChange={handleChange}
              />
              <div>
                <h3 className="text-sm -mt-1">Manager</h3>
               <Select
                  className="basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a manager"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="manager"
                  value={user.find(option => option.value === formValues.manager) || null} 
                  options={user}
                  onChange={handleSelectChange}
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderColor: 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '220px',
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
                <h3 className="text-sm -mt-1">PJ Sales</h3>
               <Select
                  className="basic-single mt-2"
                  classNamePrefix="select"
                  placeholder="Select a pj sales"
                  isDisabled={false}
                  isLoading={false} 
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name="pjsales"
                  value={user.find(option => option.value === formValues.pjsales) || null} 
                  options={user}
                  onChange={handleSelectChange}
                  styles={{
                    control: (base :any) => ({
                      ...base,
                      backgroundColor: 'transparent',  
                      borderColor: 'rgba(0, 0, 0, 0.12)', 
                      borderRadius: '8px', 
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      width: '220px',
                    }),
                    menu: (base :any) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
              <div className="flex flex-wrap md:mt-7 mt-3">
                <Button
                  size="sm"
                  color="warning"
                  title="Reset Filter"
                  className="ml-1 p-3  bg-[#ffde08] min-w-0 flex items-center justify-center"
                  onClick={resetForm}
                >
                  <VscDebugRestart className="text-lg text-white" />
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
        {/* <CardFooter>
      </CardFooter> */}
      </Card>

      {/* <Divider /> */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <h3 className="text-xl font-semibold">All Outlet</h3>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button
            size="md"
            color="primary"
            onClick={() => router.push("/master/outlet/create")}
          >
            Add Outlet
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
            <TableColumn key="codeOutlet" allowsSorting>
              OUTLET CODE 
            </TableColumn>
            <TableColumn key="outlet" allowsSorting>
              OUTLET
            </TableColumn>
            <TableColumn key="city.city" allowsSorting>
              CITY
            </TableColumn>
            <TableColumn key="address" allowsSorting>
              ADDRESS
            </TableColumn>
            <TableColumn key="area" allowsSorting>
              AREA
            </TableColumn>
            <TableColumn key="outletManager.name" allowsSorting>
              MANAGER
            </TableColumn>
            <TableColumn key="outletDetail.pjSales.name">
              PJ SALES
            </TableColumn>
            <TableColumn key="imageQr">
              QR Code
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
              <TableRow key={item.id}>
                {(columnKey) => {
                  let cellContent;

                  switch (columnKey) {
                    case "codeOutlet":
                      cellContent = item.codeOutlet;
                      break;
                    case "outlet":
                      cellContent = item.outlet;
                      break;
                    case "city.city":
                      cellContent = item.city.city;
                      break;
                    case "address":
                      cellContent = item.address;
                    break;
                    case "area":
                      cellContent = item.area;
                    break;
                    case "outletManager.name":
                      cellContent = item.outletManager.name;
                    break;
                    case "outletDetail.pjSales.name":
                      let pjNameSales = ""; 
                      item.outletDetail.map((sales :any, index :any) => {
                        pjNameSales += sales.pjSales.name; 
                        if (index !== item.outletDetail.length - 1) {
                          pjNameSales += ", ";
                        }
                      });
                      cellContent = pjNameSales; 
                    break;
                    case "imageQr":
                      cellContent = item.imageQr ? (
                        <Avatar
                          isBordered
                          color="default"
                          radius="sm"
                          src={item.imageQr}
                          className="w-20 h-20 text-large"
                        />
                      ) : (
                        <span>-</span>
                      );
                    break;
                    case "action":
                      cellContent = (
                        <div className="flex items-center gap-4">
                           <div>
                            <Tooltip content="QR Code">
                              <button
                                onClick={() =>  handleOpen(item.imageQr)}
                              >
                                <EyeIcon size={20} fill="#348CF1" />
                              </button>
                            </Tooltip>
                          </div>  
                          <div>
                            <Tooltip content="Edit" color="foreground">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/master/outlet/edit/${item.id}`
                                  )
                                }
                              >
                                <EditIcon size={20} fill="#52525B" />
                              </button>
                            </Tooltip>
                          </div>
                          <div>
                            <Tooltip
                              content="Delete"
                              color="danger"
                            >
                              <button onClick={() => handleDelete(item.id)}>
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
        <Modal 
        size={"sm"} 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">QR Code</ModalHeader>
              <ModalBody>
                <div className="flex justify-center">
                  {imagePreviewQr ? 
                    <Image
                        key={imagePreviewQr}
                        className="bg-auto"
                        alt={`Preview of ${imagePreviewQr}`}
                        src={imagePreviewQr}
                      />
                  : 
                    <p>Not Found.</p>
                  }
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light"  
                  onPress={() => {
                    onClose();
                    setImagePreviewQr(null); 
                  }}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      </div>
    </div>
  );
};
