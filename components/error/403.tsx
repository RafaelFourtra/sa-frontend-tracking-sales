// pages/403.js

import { Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { IoMdLock } from "react-icons/io";


export default function ForbiddenError() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card
        isHoverable
        className="max-w-sm p-10 text-center shadow-lg bg-white"
      >
        <h1 className="text-6xl font-bold text-red-600">403</h1>
        <h2 className="text-2xl font-semibold mt-4 text-gray-700">
          Akses Dilarang
        </h2>
        <p className="text-gray-600 mt-2">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Button
          size="lg"
          color="warning"
          className="flex items-center gap-2 mt-6"
          onPress={() => router.push("/")}
        >
          <IoMdLock className="text-lg" />
          Kembali ke Home
        </Button>
      </Card>
    </div>
  );
}


