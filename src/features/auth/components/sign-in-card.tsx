import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignUpFlow } from "../type";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react"
import { useRouter } from "next/navigation";


interface SignInCardProps {
  setState: (state: SignUpFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .then(() => {
        router.push("/");
      })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setPending(false);
      });
  }

  const onProviderSignIn = (provider: "github" | "google") => {
    setPending(true);
    signIn(provider)
      .finally(() => {
        setPending(false);
      })
  }
  return (
    <Card className=" w-full h-full p-8">
      <CardHeader className=" px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className=" bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4"/>
          <p>{error}</p>
        </div>
      )}
      <CardContent className=" space-y-5 px-0 pb-0">
        <form className=" space-y-2.5" onSubmit={onPasswordSignIn}>
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" className=" w-full" size="lg" disabled={pending}>
            Sign In
          </Button>
        </form>
        <Separator />
        <div className=" flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn("google")}
            variant="outline"
            size="lg"
            className=" w-full relative"
          >
            <FcGoogle className=" absolute left-2.5 size-5 top-2.5" />
            Sign in with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn("github")}
            variant="outline"
            size="lg"
            className=" w-full relative"
          >
            <FaGithub className=" absolute left-2.5 size-5 top-2.5" />
            Sign in with GitHub
          </Button>
        </div>
        <p className=" text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className=" text-sky-700 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
