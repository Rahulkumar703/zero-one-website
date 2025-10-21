import { OnGoingEvent } from "@/components/events/Ongoing";
import { Upcoming } from "@/components/events/Upcoming";
import { Past } from "@/components/events/Past";
import { getEvents } from "@/action/events";
import { Trophy } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function Events() {
  const { events } = await getEvents();

  const pastEvents = events.filter((event) => {
    const currentDate = new Date();
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(
      eventStartDate.getTime() + event.durationMinutes * 60 * 1000
    );
    return eventEndDate < currentDate;
  });

  const ongoingEvents = events.filter((event) => {
    const currentDate = new Date(); // Always get the latest time
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(
      eventStartDate.getTime() + event.durationMinutes * 60 * 1000
    );

    return eventStartDate <= currentDate && currentDate <= eventEndDate;
  });

  const upcomingEvents = events.filter((event) => {
    const currentDate = new Date();
    const eventStartDate = new Date(event.startDate);
    return eventStartDate > currentDate;
  });

  console.log(pastEvents[0]);

  return (
    <section className="mt-10 mb-8 sm:my-8 px-20 2xl:px-10 xl:px-8 sm:px-6 xs:px-3">
      <div className={`flex flex-col gap-10 items-center min-h-screen`}>
        <Trophy className="text-accent size-36" />
        <h2 className={`text-6xl sm:text-5xl font-semibold`}>
          ZERO ONE Events
        </h2>
        <div
          className={`mb-10 sm:mb-7 sm:text-lg box-border w-3/5 xl:w-full xl:pl-0 text-center`}
        >
          Zero One Coding Club hosts fun events like workshops, hackathons, and
          contests. These help us learn and have a good time. We get to improve
          our coding skills, be creative in hackathons, and enjoy friendly
          contests. It&apos;s a cool place for both beginners and coding fans!
        </div>
        <div className="grid grid-cols-2">
          {pastEvents.length ? (
            <Link
              href="/"
              className="flex flex-col items-center hover:scale-105 transition-all ease-in-out duration-300 shadow-cus border border-white/5 rounded-3xl w-full"
            >
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{pastEvents[0].name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ) : null}
          {upcomingEvents.length ? (
            <Link
              href={`/contest/${upcomingEvents[0].slug}`}
              className="flex flex-col items-center hover:scale-105 transition-all ease-in-out duration-300 shadow-cus border border-white/5 rounded-3xl w-full"
            >
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{upcomingEvents[0].name}</CardTitle>
                  <CardDescription>
                    {upcomingEvents[0].description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ) : null}
        </div>
      </div>
      {/* <div className="flex flex-col gap-10 min-h-screen"></div> */}
    </section>
  );
}
