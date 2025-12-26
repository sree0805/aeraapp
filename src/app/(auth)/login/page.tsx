import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { login } from "../actions";
import { OAuthSignIn } from "../oauth-signin";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string, message?: string }>;
}) {
    const params = await searchParams;

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
                <CardDescription>
                    Enter your email and password to access your account
                </CardDescription>
            </CardHeader>
            <form action={login}>
                <CardContent className="space-y-4">
                    {params?.message && (
                        <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-100 px-4 py-2 rounded text-sm text-center">
                            {params.message}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="#"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    {params?.error && (
                        <div className="text-red-500 text-sm font-medium">
                            {params.error}
                        </div>
                    )}
                    <Button className="w-full" type="submit">
                        Login
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <OAuthSignIn />
                </CardContent>
            </form>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                    <span className="mr-1 hidden sm:inline-block">Don&apos;t have an account?</span>
                    <Link
                        aria-label="Sign up"
                        href="/signup"
                        className="text-primary hover:underline underline-offset-4"
                    >
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
