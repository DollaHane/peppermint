"use client"
import React from "react"
import { Button } from "@/src/components/components-ui/Button"

export default function Profile() {
  return (
    <div className="z-20 mx-auto mb-52 min-h-screen w-11/12 min-w-[280px] overflow-hidden md:w-8/12">
      <h1 className="mt-10 text-xl font-bold text-primary">Profile</h1>
      <hr className="my-2 border border-t-muted-foreground" />

      {/* USER DETAILS */}
      <div className="space-y-5 text-primary">
        <h2 className="mb-5 font-bold text-customAccent">User Details:</h2>
        <div className="grid w-full grid-cols-2">
          <p className="font-bold">Name:</p>
          <p>Shane Hubsch</p>
        </div>
        <div className="grid w-full grid-cols-2">
          <p className="font-bold">Email:</p>
          <p>shane@gmail.com</p>
        </div>
        <div className="grid w-full grid-cols-2">
          <p className="font-bold">Phone Number:</p>
          <p>+27 (0) 60 460 7122</p>
        </div>
        <div className="flex w-full items-center justify-end">
          <Button variant="outline">Edit</Button>
        </div>
      </div>
      <hr className="mb-2 mt-5 border border-t-muted-foreground" />

      {/* SUBSCRIPTION */}
      <div className="space-y-5 text-primary">
        <h2 className="mb-5 font-bold text-customAccent">
          Subscription Details:
        </h2>
        <div className="grid w-full grid-cols-2">
          <p className="font-bold">Subscription Plan:</p>
          <p>Pro Plan</p>
        </div>
        <div className="grid w-full grid-cols-2">
          <p className="font-bold">Billing Amount:</p>
          <p>R 65.00 p/month</p>
        </div>
        <div className="flex w-full items-center justify-end">
          <Button variant="outline">Edit</Button>
        </div>
      </div>
      <hr className="mb-2 mt-5  border border-t-muted-foreground" />

      {/* SECURITY */}
      <div className="space-y-5 text-primary">
        <h2 className="mb-5 font-bold text-customAccent">
          Security:
        </h2>
        <div className="grid w-full grid-cols-2">
          <p className="font-bold pt-1">Reset Password:</p>
          <p>
            <Button variant="outlineTwo">RESET</Button>
          </p>
        </div>
      </div>
      <hr className="mb-2 mt-5  border border-t-muted-foreground" />
    </div>
  )
}
