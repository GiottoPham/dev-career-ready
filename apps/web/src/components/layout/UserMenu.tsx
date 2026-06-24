import { useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { signOut } from "@/lib/auth-client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { UserAvatar } from "./UserAvatar"

type UserMenuProps = {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: "/" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ minWidth: `calc(max(80px, ${user.email.length * 8}px))` }}>
        <DropdownMenuGroup>
          {/* User info (non-interactive) */}
          <DropdownMenuItem className="text-sm font-bold">{user.name}</DropdownMenuItem>
          <DropdownMenuItem className="text-muted-foreground text-xs">{user.email}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-muted-foreground hover:bg-muted cursor-pointer px-3 py-2 text-xs transition-colors"
            onClick={handleSignOut}
          >
            {t("nav.signOut")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
