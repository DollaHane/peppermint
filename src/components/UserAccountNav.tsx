"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"

import { User } from "../types/user"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components-ui/DropdownMenu"
import { UserAvatar } from "./components-ui/UserAvatar"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { setTheme, theme } = useTheme()

  const userName = user?.name
  const userImage = user?.image

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: userName, image: userImage }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="relative" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-bold">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-primary">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuItem asChild>
          <Link href="/p/mint/create">Create Ad</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/p/mymints">My Ads</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <div>
            <p className="dark:hidden">Dark Mode</p>
            <p className="hidden dark:block">Light Mode</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-500 focus:text-red-500 border-2 focus:border-red-500"
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/signin`,
            })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
