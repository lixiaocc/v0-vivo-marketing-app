"use client"

import Link from "next/link"

export default function BatchBudgetPage() {
  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto relative pb-[72px] overflow-x-hidden">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <Link href="/account" className="text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-medium text-gray-800">批量设置预算</h1>
      </header>

      {/* 内容区域 */}
      <main className="px-4 py-3 space-y-3 flex flex-col items-center">
        {/* 占位内容 */}
        <div className="w-[361px] bg-white rounded-lg p-4 h-[200px] flex items-center justify-center">
          <span className="text-sm text-gray-400">批量设置预算功能开发中...</span>
        </div>
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[72px] bg-white border-t border-gray-200 px-4 flex items-center">
        <div className="flex justify-around items-center w-full">
          <Link href="/" className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">首页</span>
          </Link>
          <div className="flex flex-col items-center gap-1">
            <span className="bg-blue-500 text-white text-xs px-4 py-1.5 rounded-full">账户</span>
          </div>
          <Link href="/profile" className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">个人中心</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
