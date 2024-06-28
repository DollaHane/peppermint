"use client"
import React, { useState, useRef, useEffect } from "react"
import { roomType, messagesType } from "@/src/types/db"
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTrigger,
} from "../components-ui/Sheet"
import { Loader2 } from "lucide-react"
import { Button } from "../components-ui/Button"
import { ScrollArea } from "../components-ui/ScrollArea"
import { Textarea } from "../components-ui/Textarea"
import { useSession } from "next-auth/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "@/src/hooks/use-toast"
import { useForm } from "@tanstack/react-form"
import { FieldApi } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import {
  ChatMessageCreationRequest,
  validateMessage,
} from "@/src/lib/validators/validateChatMessage"
import {
  onChangeAsync,
  onChangeAsyncDebounceMs,
} from "@/src/lib/validators/validateListing"
import { formatDateFromTimestamp } from "@/src/lib/utils"
import ChatRoomTrigger from "./ChatRoomTrigger"
import { cn } from "@/src/lib/utils"

interface ChatRoomProps {
  roomData: roomType
  messages: messagesType[]
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em className="absolute -bottom-8 text-rose-500">
          {field.state.meta.touchedErrors}
        </em>
      ) : null}
    </>
  )
}

export default function ChatRoom({ roomData, messages }: ChatRoomProps) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const [disabled, setDisabled] = useState<boolean>(false)
  const [bottom, setBottom] = useState<boolean>(false)

  // SET TRIGGER USER DETAILS
  const userName = () => {
    if (roomData.seller.id !== session?.user.id) {
      return (
        <ChatRoomTrigger
          roomData={roomData}
          userName={roomData.seller.name}
          userImage={roomData.seller.image}
        />
      )
    } else {
      return (
        <ChatRoomTrigger
          roomData={roomData}
          userName={roomData.buyer.name}
          userImage={roomData.buyer.image}
        />
      )
    }
  }

  // TANSTACK FORM
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      message: "",
      roomId: roomData.chatRoom.id,
      userId: session?.user.id,
      userName: session?.user.name,
    },
    onSubmit: async ({ value }) => {
      const payload: ChatMessageCreationRequest = {
        message: value.message,
        roomId: roomData.chatRoom.id,
        userId: session?.user.id || "",
        userName: session?.user.name || "",
      }
      sendChatMessage(payload)
      setDisabled(true)
      setBottom(true)
    },
  })

  // NEW MESSAGE MUTATION
  const {
    mutate: sendChatMessage,
    variables,
    isPending,
  } = useMutation({
    mutationFn: async ({
      message,
      roomId,
      userId,
      userName,
    }: ChatMessageCreationRequest) => {
      const payload: ChatMessageCreationRequest = {
        message,
        roomId,
        userId,
        userName,
      }
      await axios.post("/api/createChatMessage", payload)
    },
    onError: (error) => {
      console.log("error:", error)
      return toast({
        title: "Something went wrong.",
        description: "Error sending message. Please try again.",
        variant: "destructive",
      })
    },
    onSuccess: () => {
      setBottom(false)
      form.reset()
    },
    onSettled: async (_, error) => {
      setDisabled(false)
      if (error) {
        console.log("onSettled error:", error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["messages", roomData.chatRoom.id],
        })
      }
    },
  })

  // FOCUS ON NEW MESSAGE
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [bottom])

  return (
    <Sheet>
      <SheetTrigger>
        <div className="h-full w-full">{userName()}</div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="absolute top-0 z-40 mb-5 mr-10 h-16 w-[315px] bg-background pt-5 text-lg font-bold text-customAccent">
          <h1>Messages</h1>
        </SheetHeader>

        <div className="relative z-30 mt-11 flex h-[85vh] w-full flex-col justify-end overflow-hidden">
          <div className="flex h-full w-full rounded-md pb-10 pt-32">
            <ScrollArea className="mt-2 h-auto  w-full pr-5">
              <p className="w-full text-end text-xs italic text-muted-foreground">
                Start of conversation...
              </p>
              {messages &&
                messages.map((msg: messagesType, i: any) => (
                  <>
                    {msg.roomId === roomData.chatRoom.id && (
                      <div
                        className="mt-3 flex flex-col justify-center rounded-md bg-background p-2"
                        key={i}
                        ref={i === messages.length - 1 ? bottomRef : null}
                      >
                        <span
                          className={cn(
                            "flex font-bold text-xs italic text-primary",
                            session?.user.id === msg.userId &&
                              "justify-end text-customAccent"
                          )}
                        >
                          {msg.userName}
                        </span>
                        <p
                          className={cn(
                            "p-1 text-left text-sm text-primary",
                            session?.user.id === msg.userId &&
                              "justify-end text-right"
                          )}
                        >
                          {msg.message}
                        </p>
                        <span className={cn("flex w-full text-left pl-1 text-[10px] italic text-muted-foreground", session?.user.id === msg.userId && "justify-end text-right")}>
                          {formatDateFromTimestamp(msg.createdAt!)}
                        </span>
                      </div>
                    )}
                  </>
                ))}
              {isPending && (
                <div
                  className="mt-3 flex flex-col justify-center rounded-md bg-background p-2 shadow-lg"
                  key={variables.roomId}
                >
                  <div className="flex justify-between">
                    <span className="flex w-full justify-end text-right text-xs font-bold italic text-customAccent">
                      {variables.userName}
                    </span>
                  </div>
                  <p className="p-1 text-right text-sm text-primary">
                    {variables.message}
                  </p>
                  <span className="flex w-full justify-end text-xs italic text-muted-foreground">
                    Pending
                  </span>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* SUBMIT MESSAGE */}
          <form.Provider>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                void form.handleSubmit()
              }}
            >
              <div className="flex h-full w-full flex-col justify-end">
                <form.Field
                  name="message"
                  validators={{
                    onChange: validateMessage,
                    onChangeAsyncDebounceMs: onChangeAsyncDebounceMs,
                    onChangeAsync: onChangeAsync,
                  }}
                >
                  {(field) => (
                    <>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-full w-full bg-muted text-primary"
                        required
                      />
                    </>
                  )}
                </form.Field>
                <form.Subscribe
                  /* @ts-ignore */
                  selector={(state) => [
                    state.canSubmit,
                    state.isSubmitting,
                    state.isSubmitted,
                    state.errors,
                  ]}
                >
                  {/* @ts-ignore */}
                  {([canSubmit, isSubmitting]) => (
                    <Button
                      type="submit"
                      disabled={disabled || !canSubmit}
                      variant="outlineTwo"
                      className="mt-5 w-20 hover:bg-customAccent hover:text-zinc-100"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Send"
                      )}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </form>
          </form.Provider>
        </div>
      </SheetContent>
    </Sheet>
  )
}
