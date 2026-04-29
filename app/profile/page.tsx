"use client"

import Link from "next/link"
import { Bell, Shield, FileText, Settings, HelpCircle, Info, LogOut, ChevronRight } from "lucide-react"

export default function ProfilePage() {
  const menuItems = [
    { icon: Bell, label: "消息通知" },
    { icon: Shield, label: "账户安全" },
    { icon: FileText, label: "操作记录" },
    { icon: Settings, label: "偏好设置" },
    { icon: HelpCircle, label: "帮助中心" },
    { icon: Info, label: "关于我们" },
    { icon: LogOut, label: "退出登录", isLogout: true },
  ]

  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto relative pb-[72px] overflow-x-hidden">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-base font-medium text-gray-800">个人中心</h1>
        <Settings className="w-5 h-5 text-gray-400" />
      </header>

      {/* 内容区域 */}
      <main className="px-4 py-3 space-y-3 flex flex-col items-center">
        {/* 用户信息卡片 */}
        <div className="w-[361px] bg-white rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-300" />
            <div>
              <div className="text-base font-medium text-blue-500">张经理</div>
              <div className="text-xs text-gray-500 mt-0.5">客户管理员</div>
              <div className="text-xs text-gray-400 mt-0.5">ID:12345678</div>
            </div>
          </div>
        </div>

        {/* 菜单列表 */}
        <div className="w-[361px] bg-white rounded-lg overflow-hidden">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className={`px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.isLogout ? "text-gray-500" : "text-gray-500"}`} />
                <span className={`text-sm ${item.isLogout ? "text-gray-600" : "text-gray-700"}`}>
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
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
