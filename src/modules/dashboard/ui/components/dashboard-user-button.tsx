import React from "react";
import { authClient } from "@/lib/auth-client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DashboardUserButton() {
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter();

  const handleLogout = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logout successful", { id: "sign-out-success" });
          router.push("/sign-in");
        },
      },
    });

  if (isPending || !session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
        {session.user.image ? (
          <Avatar>
            <AvatarImage src={session.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={session.user.name}
            variant="initials"
            className="size-9 mr-3"
          />
        )}

        <div className="flex flex-col gap-0.5 text-left flex-1 overflow-hidden min-w-0">
          <p className="truncate text-sm w-full">{session.user.name}</p>
          <p className="truncate text-xm w-full">{session.user.email}</p>
        </div>

        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{session.user.name}</span>
            <span className="text-sm truncate font-normal text-muted-foreground">
              {session.user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between cursor-pointer"
          onClick={handleLogout}
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
