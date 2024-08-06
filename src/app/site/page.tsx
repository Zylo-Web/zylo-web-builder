import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import clsx from "clsx";
import { Check } from "lucide-react";
import Link from 'next/link'
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col">
        {/* grid */}
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-white dark:bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <p className="text-center">Run your agency in one place</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Zylo
          </h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src={"/assets/ZyloDashboard.jpg"}
            alt="Banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 md:mt-20 mt-10 ">
        <h2 className="text-4xl text-center">Choose what fits you right</h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing planes are tailored to meet you needs. If{" "}
          {" you're"} not <br /> ready to commit you can get started for free
        </p>
        <div className="flex justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((card) => {
            return (
              <Card
                key={card.title}
                className={clsx("w-[300px] flex flex-col justify-between", {
                  "border-2 border-primary": card.title === "unlimited Saas",
                })}
              >
                <CardHeader>
                  <CardTitle
                    className={clsx("", {
                      "text-muted-foreground": card.title !== "Unlimited Saas",
                    })}
                  >
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>

                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold">
                    {card.price}
                  </span>
                  <span className="text-muted-foreground">
                    /m
                  </span>
                </CardContent>
                <CardFooter className=" flex flex-col items-start gap-4">
                  <div>
                    {card.features.map((feature )=> {
                      return (
                        <div key={feature} className=" flex gap-2 items-center">
                          <Check />
                          <p>{feature}</p>
                        </div>
                      );
                    })}
                  </div>
                  <Link href={`/agency?plan=${card.priceId}`} className={clsx('w-full text-center bg-primary p-2 rounded-md text-white', {'!bg-muted-foreground':card.title !=='Unlimited Saas'})}>
                  Get Started
                  </Link>

                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}

