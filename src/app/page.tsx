import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import SplashCursor from "@/components/ui/SplashCoursor";
import { Key, User } from "lucide-react";

export default function Home() {
  return (
    <div className="">
      <div className="absolute w-full top-0">
        <div className="flex items-center justify-between py-5 px-10">
          <p className="font-black text-3xl">
            Aurora <b className="text-primary">Chasers</b>
          </p>
          <div className="flex items-center gap-3">
            <Button className="h-12 font-bold">Post Aurora</Button>
            <Popover>
              <PopoverTrigger>
                  <User />
              </PopoverTrigger>
              <PopoverContent className="flex gap-3 flex-col items-start w-[150px] mr-10">
                <Button variant="link">
                  <a className="flex items-center gap-3" href="/login">
                    <Key /> Login
                  </a>
                </Button>
                <Button variant="link">
                  <a className="flex items-center gap-3" href="/signup">
                    <User /> Sign Up
                  </a>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Separator />
      </div>
      <SplashCursor />
      <div className="h-screen flex items-center justify-center">
        <p className="text-5xl font-black uppercase text-center leading-relaxed">
          Creating a place where <br /> Auroras are the spotlight
        </p>
      </div>
    </div>
  );
}
