"use client"
import React from "react"
import Link from "next/link"
import { FileEdit } from "lucide-react"
import MintDelete from "./MintDelete"
import MintManageOffers from "./MintManageOffers"
import MintManageQueries from "./MintManagerQueries"
import ChatSheet from "../pageMintChat/ChatSheet"
import ShareButtons from "./ShareButtons"
import { listingsType } from "@/src/types/db"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { offerType, queryType } from "@/src/types/db"

interface UserActionsProps {
  listing: listingsType
  offers: offerType[]
  queries: queryType[]
  isLoading: boolean
  domain: string
}

export default function MintPageAuthorActions({
  offers,
  queries,
  listing,
  isLoading,
  domain,
}: UserActionsProps) {
  const { data: session } = useSession()
  const userId = session?.user.id!

  return (
    <div className="flex w-full justify-end space-x-1 md:space-x-2">
      <ShareButtons domain={domain} />
      <MintManageOffers offers={offers} isLoading={isLoading} />
      <MintManageQueries queries={queries} userId={userId} />
      <Link
        href={`/ad/edit/${listing.id}`}
        className="group flex h-10 w-10 items-center justify-center hover:text-amber-500"
      >
        <FileEdit />
      </Link>
      <MintDelete listingId={listing.id} />
      <ChatSheet listingId={listing.id} />
    </div>
  )
}
