"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatTimeToNow } from "@/src/lib/utils"
import { listingsType } from "@/src/types/db"
import { Image, MapPin } from "lucide-react"

import AdTagsMini from "../adTags/AdTagsMini"

interface MyMintsProps {
  listing: listingsType
}

export default function CarouselMintCardComponent({ listing }: MyMintsProps) {
  const [adImage, setAdImage] = useState([])
  const jsonImage = listing.images

  useEffect(() => {
    if (jsonImage) {
      const images = JSON.parse(jsonImage)
      setAdImage(images)
    }
  }, [jsonImage])

  const price = listing.price
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  })

  const formattedPrice = formatter.format(price!)

  return (
    <div className="h-60 w-40 rounded-lg border border-muted bg-background shadow-md transition duration-100 hover:scale-[0.99]">
      <Link href={listing.url}>
        <div className="relative flex h-full w-full flex-col">
          <div className="w-full">
            {/* IMAGE */}
            <div className="h-28 w-full">
              {!adImage[0] ? (
                <div className="flex h-full w-full justify-center rounded-lg bg-muted align-middle">
                  <Image
                    className="my-auto h-[50%] w-[50%] animate-pulse text-muted-foreground"
                    alt="imageLoad"
                  />
                </div>
              ) : (
                <img
                  src={adImage[0]}
                  alt={adImage[0]}
                  className="h-full w-full rounded-t-lg object-cover"
                />
              )}
            </div>

            {/* TAGS */}
            <div className="absolute -left-3 -top-3 w-full">
              <AdTagsMini listing={listing} />
            </div>
          </div>

          {/* INFO */}
          <div className="h-full w-full p-1">
            <div>
              <h1 className=" line-clamp-2 h-12 text-sm font-bold text-primary">
                {listing.title}
              </h1>
            </div>

            <div className="">
              <h1 className="text-lg font-bold text-customAccent">
                R {formattedPrice}
              </h1>
            </div>

            <div className="absolute bottom-6 left-1 flex gap-1 text-xs italic text-secondary">
              <MapPin className="h-4 w-4 justify-center" />
              <span className="text-xs font-bold text-primary">
                {listing.location}
              </span>
            </div>

            <div className="absolute bottom-1 left-2 flex gap-1 text-xs italic text-secondary">
              <span>Listed</span>
              {formatTimeToNow(new Date(listing.createdAt!))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
