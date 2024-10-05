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
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";

interface SignUpCardProps {
  setState: (state: SignUpFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>("");

  const onPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setPending(true);
    signIn("password", { email, password, name, flow: "signUp" })
      .then(() => {
        router.push("/auth");
      })
      .catch((error) => {
        console.log("Error: ",error);
        if(error instanceof ConvexError){
          setError((error.data as { message: string }).message);
        }else{
          setError("Something went wrong, please try again later");
        }
      })
      .finally(() => {
        setPending(false);
      });
  }

  const onProviderSignUp = (provider: "github" | "google") => {
    setPending(true);
    signIn(provider)
      .finally(() => {
        setPending(false);
      })
  }

  return (
    <Card className=" w-full h-full p-8">
      <CardHeader className=" px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
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
        <form className=" space-y-2.5" onSubmit={onPasswordSignUp}>
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
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
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
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
            onClick={() => onProviderSignUp("google")}
            variant="outline"
            size="lg"
            className=" w-full relative"
          >
            <FcGoogle className=" absolute left-2.5 size-5 top-2.5" />
            Sign in with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("github")}
            variant="outline"
            size="lg"
            className=" w-full relative"
          >
            <FaGithub className=" absolute left-2.5 size-5 top-2.5" />
            Sign in with GitHub
          </Button>
        </div>
        <p className=" text-sm text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}
            className=" text-sky-700 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
