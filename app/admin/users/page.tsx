"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/tolgee-optimized";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    votes: number;
  };
}

export default function ManageUsersPage() {
  const { t } = useTranslations();
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('accessDeniedTitle', 'Access Denied')}</h1>
            <p className="mb-4">{t('accessDeniedMessage', 'You need admin privileges to access this page.')}</p>
            <Link href="/" className="btn btn-primary">{t('goHomeButton', 'Go Home')}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('manageUsersTitle', 'Manage Users')}</h1>
          <Link href="/admin" className="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">{t('backToDashboardButton', 'Back to Dashboard')}</Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('allUsersTitle', 'All Users ({count})', { count: users.length })}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('nameColumn', 'Name')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('emailColumn', 'Email')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('roleColumn', 'Role')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('votesColumn', 'Votes')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('joinedColumn', 'Joined')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} border-b border-gray-200 dark:border-gray-700`}>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name || t('naText', 'N/A')}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'ADMIN' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{user._count.votes}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}