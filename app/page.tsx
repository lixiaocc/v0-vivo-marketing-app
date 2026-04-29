"use client"

import Link from "next/link"
import { Bell, ChevronDown } from "lucide-react"

export default function VivoHomePage() {
  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto relative pb-[72px] overflow-x-hidden">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 用户头像 */}
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <div className="text-sm font-medium text-gray-800">vivo应用商店超管</div>
            <div className="text-xs text-blue-500">直属组织</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-gray-400" />
          <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
            <span className="text-xs text-gray-400">⋯</span>
          </div>
        </div>
      </header>

      {/* 内容区域 */}
      <main className="px-4 py-3 space-y-3 flex flex-col items-center">
        {/* 数据卡片 */}
        <div className="bg-white rounded-lg p-4 w-[361px] mx-auto">
          {/* 账户选择器 */}
          <div className="flex items-center gap-1 mb-3">
            <span className="text-sm text-gray-600">全部账户</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          
          {/* 金额显示 */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-medium text-gray-800">¥0.00</span>
            <span className="text-xs text-gray-400">0次</span>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-sm text-gray-600">0.00</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">总余额</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-sm text-gray-600">0.00</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">可用余额</div>
              </div>
            </div>
          </div>
        </div>

        {/* 数据概览标题 */}
        <div className="flex items-center justify-between pt-2 w-[361px]">
          <h2 className="text-base font-medium text-gray-800">数据概览</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">今天</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm text-blue-500">自定义</span>
          </div>
        </div>

        {/* 图表占位区域1 */}
        <div className="bg-white rounded-lg w-[361px] h-[160px] flex items-center justify-center relative overflow-hidden mx-auto">
          {/* X占位符 */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#d1d5db" strokeWidth="1" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#d1d5db" strokeWidth="1" />
            <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#d1d5db" strokeWidth="1" />
          </svg>
        </div>

        {/* 图表占位区域2 */}
        <div className="bg-white rounded-lg w-[361px] h-[160px] flex items-center justify-center relative overflow-hidden mx-auto">
          {/* X占位符 */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#d1d5db" strokeWidth="1" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#d1d5db" strokeWidth="1" />
            <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#d1d5db" strokeWidth="1" />
          </svg>
        </div>
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[72px] bg-white border-t border-gray-200 px-4 flex items-center">
        <div className="flex justify-around items-center w-full">
          <div className="flex flex-col items-center">
            <span className="bg-blue-500 text-white text-xs px-4 py-1.5 rounded-full">首页</span>
          </div>
          <Link href="/account" className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">账户</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">个人中心</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
