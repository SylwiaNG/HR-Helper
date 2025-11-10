import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import Link from "next/link";

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4">
        <UpdatePasswordForm />
        <div className="text-center text-sm">
          <p className="text-gray-600">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Wróć do logowania
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
