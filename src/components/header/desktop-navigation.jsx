import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import Link from "next/link";
import { Book, GraduationCap, Home, Image, Trophy } from "lucide-react";

const DesktopNavigation = () => {
  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1 justify-center rounded-full">
            <Home className="size-4" />
            Home
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid  w-[350px] lg:grid-cols-2 p-2">
              <ListItem href="/" title="Home">
                Visit the homepage to explore our latest projects and updates
              </ListItem>
              <ListItem href="/about" title="About Us">
                Learn more about ZERO ONE and our mission
              </ListItem>
              <ListItem href="/contact" title="Contact Us">
                Get in touch with the ZERO ONE team
              </ListItem>
              <ListItem href="/teams" title="Our Teams">
                Meet the people behind ZERO ONE
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1 justify-center rounded-full">
            <GraduationCap className="size-4" />
            Learn
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid grid-cols-2  w-[350px] p-2">
              <li className={"col-span-full hover:bg-secondary rounded-xl"}>
                <Link
                  href={"/resources"}
                  className="flex items-center gap-4 p-4"
                >
                  <Book className="size-20 inline-block pointer-events-none opacity-50" />
                  <div className="">
                    <div className="text-sm leading-none font-medium mb-2">
                      Resources
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      Explore a curated list of resources to enhance your
                      learning
                    </p>
                  </div>
                </Link>
              </li>
              <ListItem href="/playground" title="Playground">
                No Autocomplete - Just Code, Run and Debug
              </ListItem>
              <ListItem href="/practice" title="Practice">
                Practice coding problems and improve your skills
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-1 justify-center rounded-full">
            <Trophy className="size-4" />
            Contests
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid  w-[350px] grid-cols-2 p-2">
              <ListItem href="/contests" title="All Contests">
                Join and participate in our coding contests
              </ListItem>
              <ListItem href="/my-contests" title="My Contests">
                View and manage the contests you have joined
              </ListItem>
              <li className={"col-span-full hover:bg-secondary rounded-xl"}>
                <Link href={"/gallery"} className="flex items-center gap-4 p-4">
                  <Image className="size-20 inline-block pointer-events-none opacity-50" />
                  <div className="">
                    <div className="text-sm leading-none font-medium mb-2">
                      Gallery
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      Explore a collection of highlights and moments from our
                      contests
                    </p>
                  </div>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
    </NavigationMenu>
  );
};

function ListItem({ title, className, children, href, ...props }) {
  return (
    <li className={`hover:bg-secondary rounded-xl ${className}`} {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="block p-4" title={children}>
          <div className="text-sm leading-none font-medium mb-2">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default DesktopNavigation;
