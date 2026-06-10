
export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white px-6 py-4 text-center text-sm text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
      <span>© 2026 NexusCore Inc. All rights reserved.</span>
      <div className="flex gap-4">
        <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
      </div>
    </footer>
  );
}