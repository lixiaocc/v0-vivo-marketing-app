"use client"

import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto relative pb-[72px] overflow-x-hidden">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 border-b border-gray-200">
        <h1 className="text-base font-medium text-gray-800">个人中心</h1>
      </header>

      {/* 内容区域 */}
      <main className="px-4 py-3 space-y-3 flex flex-col items-center">
        {/* 用户信息卡片 */}
        <div className="w-[361px] bg-white rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <div>
              <div className="text-sm font-medium text-gray-800">vivo应用商店超管</div>
              <div className="text-xs text-gray-500 mt-1">直属组织</div>
            </div>
          </div>
        </div>

        {/* 功能列表占位 */}
        <div className="w-[361px] bg-white rounded-lg overflow-hidden">
          {["账户设置", "消息通知", "帮助中心", "关于我们"].map((item, index) => (
            <div
              key={item}
              className={`p-4 flex items-center justify-between ${index !== 3 ? "border-b border-gray-100" : ""}`}
            >
              <span className="text-sm text-gray-700">{item}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[72px] bg-white border-t border-gray-200 px-4 flex items-center">
        <div className="flex justify-around items-center w-full">
          <Link href="/" className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">首页</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">账户</span>
          </Link>
          <div className="flex flex-col items-center gap-1">
            <span className="bg-blue-500 text-white text-xs px-4 py-1.5 rounded-full">个人中心</span>
          </div>
        </div>
      </nav>
    </div>
  )
}
