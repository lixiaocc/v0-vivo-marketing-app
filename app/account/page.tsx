"use client"

import Link from "next/link"

export default function AccountPage() {
  const accounts = [
    {
      id: 1,
      name: "品牌推广-A计划",
      type: "ROI",
      status: "投放中",
      statusColor: "text-blue-500",
      budget: "¥5,000",
      spent: "¥3,245",
    },
    {
      id: 2,
      name: "效果转化-B计划",
      type: "ROI",
      status: "投放中",
      statusColor: "text-blue-500",
      budget: "¥4,000",
      spent: "¥7,890",
    },
    {
      id: 3,
      name: "拉新活动-C计划",
      type: "",
      status: "已暂停",
      statusColor: "text-gray-400",
      budget: "",
      spent: "",
    },
  ]

  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto relative pb-[72px] overflow-x-hidden">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 border-b border-gray-200">
        <h1 className="text-base font-medium text-gray-800">投放账户</h1>
      </header>

      {/* 内容区域 */}
      <main className="px-4 py-3 space-y-3 flex flex-col items-center">
        {/* 搜索和筛选 */}
        <div className="w-[361px] flex items-center gap-2">
          <div className="flex-1 bg-white rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-200">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-sm text-gray-400">搜索账户名称</span>
          </div>
          <button className="bg-white rounded-lg px-3 py-2 text-sm text-gray-600 border border-gray-200 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选
          </button>
        </div>

        {/* 投放账号管理列表 */}
        <div className="w-[361px] bg-white rounded-lg overflow-hidden">
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className={`p-4 ${index !== accounts.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{account.name}</span>
                    {account.type && (
                      <span className="text-xs text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                        {account.type}
                      </span>
                    )}
                    <span className={`text-xs ${account.statusColor}`}>{account.status}</span>
                  </div>
                  {account.budget && (
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span>预算</span>
                        <span className="text-gray-700">{account.budget}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>已消耗</span>
                        <span className="text-orange-500">{account.spent}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 预算管理 */}
        <div className="w-[361px] bg-white rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">预算管理</h3>
          <div className="flex gap-3">
            <Link
              href="/account/batch-budget"
              className="flex-1 bg-gray-100 rounded-lg py-2.5 text-center text-sm text-gray-600 hover:bg-gray-200 transition-colors"
            >
              批量修改
            </Link>
            <button className="flex-1 bg-gray-100 rounded-lg py-2.5 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
              智能报优
            </button>
          </div>
        </div>

        {/* 告警设置 */}
        <div className="w-[361px] bg-white rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">告警设置</h3>
          <p className="text-xs text-gray-500">已设置3个账户预算告警</p>
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
