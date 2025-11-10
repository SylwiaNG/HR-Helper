'use client';

import { useActionState, useEffect } from "react";
import { signIn } from "@/app/auth/actions";
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

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Logowanie</CustomCardTitle>
        <CustomCardDescription>
          Wprowadź swoje dane, aby uzyskać dostęp do platformy.
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>
      </CustomCardContent>
    </CustomCard>
  );
}
