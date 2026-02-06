import Protected from '@/components/Protected';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <div className="bg-[#020617] min-h-screen text-white flex flex-col">
        <Navbar/>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </Protected>
  );
}






