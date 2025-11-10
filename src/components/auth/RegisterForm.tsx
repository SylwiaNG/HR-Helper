'use client';

import { useActionState, useEffect } from "react";
import { signUp } from "@/app/auth/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CustomCard,
  CustomCardContent,
  CustomCardDescription,
  CustomCardHeader,
  CustomCardTitle,
} from "@/components/ui/CustomCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Rejestracja</CustomCardTitle>
        <CustomCardDescription>
          Utwórz nowe konto, aby rozpocząć korzystanie z aplikacji.
        </CustomCardDescription>
      </CustomCardHeader>
      <CustomCardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adres e-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jan.kowalski@example.com"
              required
              disabled={isPending}
              onChange={() => toast.dismiss()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending}
              onChange={() => toast.dismiss()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Powtórz hasło</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              disabled={isPending}
              onChange={() => toast.dismiss()}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Rejestracja..." : "Zarejestruj się"}
          </Button>
        </form>
      </CustomCardContent>
    </CustomCard>
  );
}
