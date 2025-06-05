"use client";

import SearchSuggest from "@/components/search-suggest";
import TestCard from "@/components/test-card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const suggest = async (e: string) => {
    await new Promise((res) => setTimeout(res, 100));

    if(!e.trim().length)
      return [];

    if(e.length > 5) {
      return [{
        id: "id",
        text: "Value!",
      }]
    }

    return [
      {
        id: "id1",
        text: "Value!",
        subtext: "Value"
      },
      {
        id: "id2",
        text: "What?",
      },
    ];
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="w-full *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <TestCard />
            <TestCard />
            <TestCard />
            <TestCard />
          </div>

          <SearchSuggest suggest={suggest} />
          <Button>Test</Button>
        </div>
      </div>
    </div>
  );
}
