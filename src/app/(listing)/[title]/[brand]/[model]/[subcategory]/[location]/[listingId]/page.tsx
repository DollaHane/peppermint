import React from "react"
import MintCarousel from "@/src/components/pageMint/MintCarousel"
import MintPageAuthorActions from "@/src/components/pageMint/MintPageAuthorActions"
import MintPageUsersActions from "@/src/components/pageMint/MintPageUsersActions"
import ChatSheet from "@/src/components/pageMintChat/ChatSheet"
import MintQA from "@/src/components/pageMint/MintQA"
import MintOffer from "@/src/components/pageMintOffers/MintOffer"
import MintList from "@/src/components/pageMint/MintList"
import MintInfo from "@/src/components/pageMint/MintInfo"
import MintRenew from "@/src/components/pageMint/MintRenew"
import MintSold from "@/src/components/pageMint/MintSold"
import MintSoldRenew from "@/src/components/pageMint/MintSoldRenew"

import { authOptions } from "@/src/lib/auth/auth-options"
import { formatTimeToNow } from "@/src/lib/utils"
import { getAdOffers, getAdQueries, getListings, getUserQueries } from "@/src/server/actions"
import { db } from "@/src/server/db"
import { listings, queries } from "@/src/server/db/schema"
import { listingsType, queryType } from "@/src/types/db"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import ShareButtons from "@/src/components/pageMint/ShareButtons"

interface MintPageProps {
  params: {
    title: string
    brand: string
    model: string
    subcategory: string
    location: string
    listingId: string
  }
}

export default async function MintPage({ params }: MintPageProps) {
  const param = params
  const decodedParam = decodeURIComponent(param.listingId)
  const session = await getServerSession(authOptions)
  const domain = process.env.URL!

  // LISTING QUERY
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["prelisting"],
    queryFn: () => getListings(decodedParam),
  })

  const listing: listingsType[] =
    (await db.select().from(listings).where(eq(listings.id, decodedParam))) ||
    []

  const query: queryType[] =
    (await db.select().from(queries).where(eq(queries.adId, decodedParam))) ||
    []

  // OFFER QUERY
  await queryClient.prefetchQuery({
    queryKey: ["adOffers"],
    queryFn: () => listing && getAdOffers(listing[0].id),
  })

  // QUERIES QUERY
  await queryClient.prefetchQuery({
    queryKey: ["adQueries"],
    queryFn: () => listing && getAdQueries(listing[0].id),
  })

  // USER QUERIES QUERY
  await queryClient.prefetchQuery({
    queryKey: ["userQueries"],
    queryFn: () => listing && getUserQueries(listing[0].id, session?.user.id!),
  })

  // PRICE TEXT FORMATTER
  const formatPrice = (price: any) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    })

    return formatter.format(price)
  }

  return (
    <div className="flex h-auto w-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="mx-auto w-10/12 md:w-8/12">
          {listing &&
            listing.map((item, index) => (
              <div key={index} className="mb-60">
                {/* TOP SECTION */}
                <div className="mt-10 flex w-full flex-row justify-between">
                  <div className="my-auto w-full">
                    <div className="flex w-full justify-between">
                      <p className="mb-5 text-3xl font-bold text-customAccent">
                        R {formatPrice(item.price)}
                      </p>
                      {session &&
                        (item.price &&
                        item.title &&
                        item.authorId !== session.user.id ? (
                          <MintOffer
                            title={item.title}
                            sellerId={item.authorId}
                            adId={item.id}
                            askPrice={item.price}
                          />
                        ) : item.isExpired ? (
                          <MintRenew listing={item} />
                        ) : item.isSold ? (
                          <MintSoldRenew listing={item} />
                        ) : (
                          <MintSold listing={item} />
                        ))}
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">{item.title}</h1>
                    <p className="text-xs italic text-secondary">
                      Listed {formatTimeToNow(item.createdAt!)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col py-5 md:flex-row">
                  {/* @ts-expect-error Server Component */}
                  <MintCarousel listing={item.images} />
                  <MintInfo listing={item} />
                </div>

                {session && (
                  <>
                    {/* MANAGER SECTION */}
                    <hr className="my-2 border border-t-muted-foreground" />
                    <div className="flex min-h-[40px] items-end">
                      <ShareButtons domain={domain} />
                      {session?.user.id === item.authorId ? (
                        <MintPageAuthorActions listing={item} />
                      ) : (
                        <MintPageUsersActions listing={item} />
                      )}
                      <ChatSheet listingId={item.id} />
                    </div>
                    {/* @ts-expect-error Server Component */}
                    <MintList
                      items={item.items}
                      adId={item.id}
                      sellerId={item.authorId}
                    />
                  </>
                )}

                {/* DESCRIPTION SECTION */}
                <hr className="my-2 border border-t-muted-foreground" />
                <h1 className="mt-5 text-lg font-bold">Description:</h1>
                <p className="my-5 whitespace-pre-line pl-2 text-sm md:text-base">
                  {item.description}
                </p>
                <hr className="my-2 border border-t-muted-foreground" />

                {/* QUERIES SECTION */}
                <h1 className="mt-5 text-lg font-bold">
                  Users Wanted To Know:
                </h1>
                <MintQA listing={item}/>
              </div>
            ))}
        </div>
      </HydrationBoundary>
    </div>
  )
}
