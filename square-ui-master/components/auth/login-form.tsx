"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate network request
        setTimeout(() => {
            router.push("/")
        }, 1000)
    }

    return (
        <div className={cn("flex flex-col gap-6 animate-[fade-in-up_0.6s_ease-out_both] motion-reduce:animate-none", className)} {...props}>
            <div className="rounded-[2.5rem] border border-border/40 bg-card/80 text-card-foreground shadow-xl backdrop-blur-sm p-10 md:p-12">
                <div className="flex flex-col items-center gap-2 text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
                    <p className="text-balance text-base text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <form onSubmit={onSubmit} className="grid gap-6">
                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-1">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            disabled={isLoading}
                            className="h-12 rounded-2xl border-border/50 bg-muted/30 px-4 shadow-none transition-all focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50 focus-visible:bg-background"
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-1">Password</label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            disabled={isLoading}
                            className="h-12 rounded-2xl border-border/50 bg-muted/30 px-4 shadow-none transition-all focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50 focus-visible:bg-background"
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl text-base font-semibold shadow-sm transition-all hover:bg-accent hover:text-accent-foreground border border-input bg-background text-foreground mt-2">
                        {isLoading ? "Signing in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
