import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RightRail from '../components/RightRail';
import MobileNav from '../components/MobileNav';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';
import { useState } from 'react';

export default function AppLayout() {
  const [left, setLeft] = useState({ value: true, hover: false });
  const [right, setRight] = useState(true)
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-screen flex justify-between">
        <aside className="hidden md:flex flex-col max-w-1/4 shrink-0 group sticky top-0 h-screen border-r border-outline-variant/20 px-3 py-3">
          <button onClick={() => setLeft((prev) => ({ ...prev, value: !prev.value }))} className="w-fit  text-center text-text-secondary font-label-sm  backdrop-blur-md rounded-sm  ">
            <GoDotFill className="size-6 text-red-500 inline-block" />
          </button>
          <Sidebar left={left} setLeft={setLeft} />
        </aside>

        <main className="flex-1 min-w-0 border-r border-outline-variant/20 max-w-1/2 pb-20 md:pb-0 z-0 relative">
          <Outlet />
        </main>

        <aside className="hidden lg:flex flex-col w-1/4 shrink-0 group sticky top-0 h-screen border-r border-outline-variant/20 px-3 py-3">

          <button onClick={() => setRight((prev) => !prev)} className="w-fit  text-center text-text-secondary font-label-sm  backdrop-blur-md rounded-sm ml-auto ">
            <GoDotFill className="size-6 text-red-500 inline-block" />
          </button>

          <div className="h-full overflow-y-auto px-4 py-3 flex flex-col gap-4">
            <RightRail right={right} />
          </div>
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}