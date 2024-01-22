"use client"

import React, { useEffect, useState } from "react"
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide"
import { ChevronLeftIcon, ChevronRightIcon, Image } from "lucide-react"

import "@splidejs/react-splide/css/core"

export default function MintCarousel(listing: any) {
  const imageUrls = JSON.parse(listing.listing)

  return (
    <div className="flex w-full h-52 overflow-hidden">
      <Splide
        hasTrack={false}
        aria-label="..."
        className="w-full h-full mx-auto"
        options={{ perPage: 1, autoplay: true, type: "loop" }}
      >
        <SplideTrack>
          {imageUrls.map((images: any, index: any) => (
            <SplideSlide tabIndex={index} className="p-5">
              {imageUrls.length === 0 ? (
                <div className="flex justify-center align-middle bg-muted rounded-lg">
                  <Image className="w-[50%] h-[50%] my-auto text-muted-foreground animate-pulse" />
                </div>
              ) : (
                <div className="rounded-md h-full shadow-lg object-cover overflow-hidden">
                  <img
                    src={images}
                    alt={images}
                    className="object-cover"
                  />
                </div>
              )}
            </SplideSlide>
          ))}
        </SplideTrack>

        <div className="splide__arrows">
          <div className="absolute top-[50%] -left-6">
            <button className="splide__arrow splide__arrow--prev">
              <ChevronLeftIcon />
            </button>
          </div>
          <div className="absolute top-[50%] -right-6">
            <button className="splide__arrow splide__arrow--next">
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </Splide>
    </div>
  )
}
