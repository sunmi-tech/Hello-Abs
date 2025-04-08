"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/superbaseClient"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.")
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('로그인에 실패했습니다.')
      console.error(error)
    } else {
      router.push("/")
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    })

    if (error) {
      alert('구글 로그인에 실패했습니다.')
      console.error(error)
    } else {
      router.push('/')
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>
          Even now, you&apos;re changing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">이메일</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="이메일을 입력해주세요."
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <Input 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password" 
                  type="password" 
                  placeholder="비밀번호를 입력해주세요." 
                  required 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full">
                  로그인
                </Button>
                <Button onClick={handleGoogleLogin} variant="outline" className="w-full bg-white hover:bg-white/90 text-black">
                  <Image src="/google_icon.svg" alt="구글아이콘" width={30} height={30} />
                  구글로 로그인
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              계정이 없으신가요?{" "}
              <a href="/signup" className="underline underline-offset-4">
                회원가입
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
