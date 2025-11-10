'use client';

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

export function ResetPasswordForm() {
  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Resetowanie hasła</CustomCardTitle>
        <CustomCardDescription>
          Podaj swój adres e-mail, aby otrzymać link do zresetowania hasła.
        </CustomCardDescription>
      </CustomCardHeader>
      <CustomCardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adres e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="jan.kowalski@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Wyślij link
          </Button>
        </form>
      </CustomCardContent>
    </CustomCard>
  );
}
