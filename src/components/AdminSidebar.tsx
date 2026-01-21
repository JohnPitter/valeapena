'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/carros', label: 'Carros', icon: '🚗' },
  { href: '/admin/solicitacoes', label: 'Solicitacoes', icon: '📝' },
  { href: '/admin/emails', label: 'Emails', icon: '📧' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="text-xl font-bold text-white">
          Vale a <span className="text-blue-500">Pena</span>?
        </Link>
        <p className="text-xs text-slate-500 mt-1">Painel Admin</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700">
        <div className="bg-slate-700 rounded-lg p-3 mb-3">
          <p className="text-sm text-white truncate">{user?.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full py-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
