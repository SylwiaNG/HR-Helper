import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4">
        <LoginForm />
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Nie masz konta?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Zarejestruj się
            </Link>
          </p>
          <p className="mt-2 text-gray-600">
            <Link
              href="/reset-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Zapomniałeś hasła?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
