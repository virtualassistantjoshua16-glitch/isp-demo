"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");

    if (auth === "true") {
      setAllowed(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!allowed) return null;

  return <>{children}</>;
}
