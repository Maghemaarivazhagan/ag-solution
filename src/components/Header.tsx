"use client";

import { useEffect, useState } from "react";
import { localTime } from "@/lib/format";

const PEOPLE = [
  { name: "Maghema R A", where: "India", tz: "Asia/Kolkata" },
  { name: "Ashok", where: "USA", tz: "America/New_York" },
];

export function Header() {
  const [times, setTimes] = useState<string[]>(["--:--", "--:--"]);

  useEffect(() => {
    const tick = () => setTimes(PEOPLE.map((p) => localTime(p.tz)));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <span className="brand">Handoff Log</span>
        <div className="people">
          {PEOPLE.map((p, i) => (
            <div className="person" key={p.name}>
              <span className="name">{p.name}</span>
              <span className="where">{p.where}</span>
              <span className="clock" suppressHydrationWarning>
                {times[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
