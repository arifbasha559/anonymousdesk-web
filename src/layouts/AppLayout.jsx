import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RightRail from '../components/RightRail';
import MobileNav from '../components/MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[1280px] flex">
        {/* Left sidebar — desktop */}
        <aside className="hidden md:flex flex-col w-[300px] shrink-0 sticky top-0 h-screen border-r border-outline-variant/20 px-3 py-3">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 border-r border-outline-variant/20 max-w-[600px] pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Right rail — desktop */}
        <aside className="hidden lg:flex flex-col w-[350px] shrink-0 sticky top-0 h-screen overflow-y-auto px-4 py-3 gap-4">
          <RightRail />
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
