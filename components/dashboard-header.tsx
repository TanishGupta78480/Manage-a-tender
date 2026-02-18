"use client"

import Image from "next/image"
import Link from "next/link"
import { PlayCircle, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const userCategory = "Bakery"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40">
      {/* Gradient background */}
      <div className="bg-gradient-to-r from-[#2b124f] via-[#4b167a] to-[#6b1fa7]">
        <div className="max-w-[76rem] mx-auto px-6">

          <div className="flex h-20 items-center justify-between">
            {/* Left: Logo + Title */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center rounded-md hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/logo_purple.png"
                  alt="True North Logo"
                  width={36}
                  height={36}
                  className="object-contain brightness-0 invert"
                  priority
                />
              </Link>

              <div className="h-10 w-px bg-white mx-5" />

              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-semibold text-white">
                  Private Label Sourcing Accelerator
                </span>
                <span className="text-sm font-normal text-white/90">
                  Manage sourcing, tenders, and contracts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Nav */}
              <nav className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white px-3"
                  asChild
                >
                  <Link href="/reports" className="flex items-center gap-1.5">
                    <File className="h-4 w-4" />
                    <span className="leading-none">Reports</span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white px-3"
                  asChild
                >
                  <Link href="/training" className="flex items-center gap-1.5">
                    <PlayCircle className="h-4 w-4" />
                    <span className="leading-none">Training</span>
                  </Link>
                </Button>
              </nav>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-sm font-semibold text-white">
                        LJ
                      </div>
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 ring-2 ring-[#4b167a]" />
                    </div>

                    {/* Name + role */}
                    <div className="hidden sm:flex flex-col text-left leading-none">
                      <span className="text-sm font-medium text-white">
                        Lakshya Joshi
                      </span>
                      <span className="text-xs text-white/70">
                        PMO
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">Lakshya Joshi</p>
                      <p className="text-sm text-muted-foreground">PMO</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Animated accent bar */}
      <div
        className="h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600
                   bg-[length:200%_100%] animate-[gradient-flow_4s_linear_infinite]"
      />
    </header>
  )
}
