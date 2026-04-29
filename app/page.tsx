"use client"

import { useState } from "react"
import { Bell, ChevronDown, X, GripVertical, Search, Shield, FileText, Settings, HelpCircle, Info, LogOut, ChevronRight } from "lucide-react"

// 页面类型
type PageType = "home" | "account" | "profile" | "batchBudget"

// 可选指标列表
const availableMetrics = [
  { id: "cost", name: "消耗（元）", hasInfo: true },
  { id: "impressions", name: "展示数", hasInfo: true },
  { id: "cpm", name: "平均千次展现费用（元）", hasInfo: true },
  { id: "clicks", name: "点击数", hasInfo: true },
  { id: "ctr", name: "点击率", hasInfo: true },
  { id: "cpc", name: "平均点击单价（元）", hasInfo: false },
  { id: "exposure_cost", name: "曝光消耗", hasInfo: false },
  { id: "cash_cost", name: "现金消耗", hasInfo: false },
  { id: "conversions", name: "转化数", hasInfo: false },
  { id: "cpa", name: "平均转化成本", hasInfo: true },
]

// 默认已选指标
const defaultSelectedMetrics = [
  { id: "cost", name: "消耗（元）" },
  { id: "impressions", name: "展示数" },
  { id: "clicks", name: "点击数" },
  { id: "ctr", name: "点击率" },
  { id: "cpm", name: "平均千次展现费用（元）" },
  { id: "cpa", name: "平均转化成本" },
]

export default function VivoApp() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")
  const [batchBudgetSource, setBatchBudgetSource] = useState<string>("")

  // 跳转到批量设置预算页面
  const goToBatchBudget = (source: string = "") => {
    setBatchBudgetSource(source)
    setCurrentPage("batchBudget")
  }

  // 渲染底部TabBar
  const renderTabBar = () => (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[72px] bg-white border-t border-gray-200 px-4 flex items-center z-10">
      <div className="flex justify-around items-center w-full">
        <button
          onClick={() => setCurrentPage("home")}
          className="flex flex-col items-center"
        >
          {currentPage === "home" ? (
            <span className="bg-blue-500 text-white text-xs px-4 py-1.5 rounded-full">首页</span>
          ) : (
            <span className="text-xs text-gray-400">首页</span>
          )}
        </button>
        <button
          onClick={() => setCurrentPage("account")}
          className="flex flex-col items-center"
        >
          {currentPage === "account" ? (
            <span className="bg-blue-500 text-white text-xs px-4 py-1.5 rounded-full">账户</span>
          ) : (
            <span className="text-xs text-gray-400">账户</span>
          )}
        </button>
        <button
          onClick={() => setCurrentPage("profile")}
          className="flex flex-col items-center"
        >
          {currentPage === "profile" ? (
            <span className="bg-blue-500 text-white text-xs px-4 py-1.5 rounded-full">个人中心</span>
          ) : (
            <span className="text-xs text-gray-400">个人中心</span>
          )}
        </button>
      </div>
    </nav>
  )

  // 根据当前页面渲染内容
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage goToBatchBudget={goToBatchBudget} />
      case "account":
        return <AccountPage goToBatchBudget={goToBatchBudget} />
      case "profile":
        return <ProfilePage />
      case "batchBudget":
        return (
          <BatchBudgetPage
            source={batchBudgetSource}
            onBack={() => setCurrentPage("account")}
          />
        )
      default:
        return <HomePage goToBatchBudget={goToBatchBudget} />
    }
  }

  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto relative">
      {renderPage()}
      {currentPage !== "batchBudget" && renderTabBar()}
    </div>
  )
}

// ==================== 首页组件 ====================
function HomePage({ goToBatchBudget }: { goToBatchBudget: (source: string) => void }) {
  const [showMetricsSheet, setShowMetricsSheet] = useState(false)
  const [selectedMetrics, setSelectedMetrics] = useState(defaultSelectedMetrics)
  const [tempSelectedMetrics, setTempSelectedMetrics] = useState(defaultSelectedMetrics)
  const [searchQuery, setSearchQuery] = useState("")

  const maxMetrics = 12

  const handleOpenSheet = () => {
    setTempSelectedMetrics(selectedMetrics)
    setShowMetricsSheet(true)
  }

  const handleCloseSheet = () => {
    setShowMetricsSheet(false)
    setSearchQuery("")
  }

  const handleToggleMetric = (metric: { id: string; name: string }) => {
    const isSelected = tempSelectedMetrics.some((m) => m.id === metric.id)
    if (isSelected) {
      setTempSelectedMetrics(tempSelectedMetrics.filter((m) => m.id !== metric.id))
    } else if (tempSelectedMetrics.length < maxMetrics) {
      setTempSelectedMetrics([...tempSelectedMetrics, metric])
    }
  }

  const handleRemoveMetric = (metricId: string) => {
    setTempSelectedMetrics(tempSelectedMetrics.filter((m) => m.id !== metricId))
  }

  const handleReset = () => {
    setTempSelectedMetrics(defaultSelectedMetrics)
  }

  const handleSave = () => {
    setSelectedMetrics(tempSelectedMetrics)
    setShowMetricsSheet(false)
    setSearchQuery("")
  }

  const filteredMetrics = availableMetrics.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="pb-[72px] overflow-x-hidden">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
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
        {/* 预算预警消息卡片 */}
        <button
          onClick={() => goToBatchBudget("来自预算预警")}
          className="w-[361px] bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-left hover:bg-amber-100 transition-colors"
        >
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-amber-700 font-medium">预算预警</p>
            <p className="text-xs text-amber-600 mt-0.5">3个账户预算即将耗尽，点击查看详情</p>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400 ml-auto mt-1" />
        </button>

        {/* 数据卡片 */}
        <div className="bg-white rounded-lg p-4 w-[361px]">
          <div className="flex items-center gap-1 mb-3">
            <span className="text-sm text-gray-600">全部账户</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-medium text-gray-800">¥0.00</span>
            <span className="text-xs text-gray-400">0次</span>
          </div>
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
            <button onClick={handleOpenSheet} className="text-sm text-blue-500">
              自定义
            </button>
          </div>
        </div>

        {/* 图表占位区域1 */}
        <div className="bg-white rounded-lg w-[361px] h-[160px] flex items-center justify-center relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#d1d5db" strokeWidth="1" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#d1d5db" strokeWidth="1" />
            <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#d1d5db" strokeWidth="1" />
          </svg>
        </div>

        {/* 图表占位区域2 */}
        <div className="bg-white rounded-lg w-[361px] h-[160px] flex items-center justify-center relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#d1d5db" strokeWidth="1" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#d1d5db" strokeWidth="1" />
            <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#d1d5db" strokeWidth="1" />
          </svg>
        </div>
      </main>

      {/* 自定义指标弹层 */}
      {showMetricsSheet && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={handleCloseSheet} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[75%] bg-white rounded-t-xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="w-6" />
              <h3 className="text-base font-medium text-gray-800">自定义指标</h3>
              <button onClick={handleCloseSheet} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索指标"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm flex-1 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden px-4">
              <div className="flex-1 flex flex-col overflow-hidden pr-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-500">可选指标（{availableMetrics.length}）</span>
                </div>
                <div className="text-xs text-gray-400 mb-2">基础指标</div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {filteredMetrics.map((metric) => {
                    const isSelected = tempSelectedMetrics.some((m) => m.id === metric.id)
                    return (
                      <label key={metric.id} className="flex items-center gap-2 py-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleMetric(metric)}
                          disabled={!isSelected && tempSelectedMetrics.length >= maxMetrics}
                          className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{metric.name}</span>
                        {metric.hasInfo && <span className="text-gray-400 text-xs">?</span>}
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="flex-1 flex flex-col overflow-hidden pl-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-orange-500">
                    已选指标（{tempSelectedMetrics.length}/{maxMetrics}）
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {tempSelectedMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-300" />
                        <span className="text-sm text-gray-700">{metric.name}</span>
                      </div>
                      <button onClick={() => handleRemoveMetric(metric.id)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
              <button onClick={handleReset} className="text-sm text-gray-500">重置</button>
              <button onClick={handleSave} className="bg-gray-800 text-white text-sm px-6 py-2 rounded-full">
                保存并应用
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ==================== 账户页组件 ====================
function AccountPage({ goToBatchBudget }: { goToBatchBudget: (source: string) => void }) {
  const accounts = [
    { id: 1, name: "品牌推广-A计划", type: "ROI", status: "投放中", statusColor: "text-blue-500", budget: "¥5,000", spent: "¥3,245" },
    { id: 2, name: "效果转化-B计划", type: "ROI", status: "投放中", statusColor: "text-blue-500", budget: "¥4,000", spent: "¥7,890" },
    { id: 3, name: "拉新活动-C计划", type: "", status: "已暂停", statusColor: "text-gray-400", budget: "", spent: "" },
  ]

  return (
    <div className="pb-[72px] overflow-x-hidden">
      <header className="bg-white px-4 py-3 border-b border-gray-200">
        <h1 className="text-base font-medium text-gray-800">投放账户</h1>
      </header>
      <main className="px-4 py-3 space-y-3 flex flex-col items-center">
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
        <div className="w-[361px] bg-white rounded-lg overflow-hidden">
          {accounts.map((account, index) => (
            <div key={account.id} className={`p-4 ${index !== accounts.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{account.name}</span>
                    {account.type && (
                      <span className="text-xs text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">{account.type}</span>
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
        <div className="w-[361px] bg-white rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">预算管理</h3>
          <div className="flex gap-3">
            <button
              onClick={() => goToBatchBudget("")}
              className="flex-1 bg-gray-100 rounded-lg py-2.5 text-center text-sm text-gray-600 hover:bg-gray-200 transition-colors"
            >
              批量修改
            </button>
            <button className="flex-1 bg-gray-100 rounded-lg py-2.5 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
              智能报优
            </button>
          </div>
        </div>
        <div className="w-[361px] bg-white rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">告警设置</h3>
          <p className="text-xs text-gray-500">已设置3个账户预算告警</p>
        </div>
      </main>
    </div>
  )
}

// ==================== 个人中心组件 ====================
function ProfilePage() {
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
    <div className="pb-[72px] overflow-x-hidden">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-base font-medium text-gray-800">个人中心</h1>
        <Settings className="w-5 h-5 text-gray-400" />
      </header>
      <main className="px-4 py-3 space-y-3 flex flex-col items-center">
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
        <div className="w-[361px] bg-white rounded-lg overflow-hidden">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className={`px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gray-500" />
                <span className={`text-sm ${item.isLogout ? "text-gray-600" : "text-gray-700"}`}>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// ==================== 批量设置预算组件 ====================
function BatchBudgetPage({ source, onBack }: { source: string; onBack: () => void }) {
  const [budgetType, setBudgetType] = useState<"unified" | "percentage">("unified")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [percentage, setPercentage] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSourceTip, setShowSourceTip] = useState(!!source)
  const [showToast, setShowToast] = useState(false)

  const [selectedAccounts, setSelectedAccounts] = useState([
    { id: 1, name: "品牌推广-A计划", budget: "¥5,000/天", checked: false },
    { id: 2, name: "效果转化-B计划", budget: "¥3,000/天", checked: false },
    { id: 3, name: "拉新活动-C计划", budget: "¥3,000/天", checked: false },
  ])

  const selectedCount = selectedAccounts.filter((a) => a.checked).length

  const toggleAccount = (id: number) => {
    const newAccounts = selectedAccounts.map((acc) => (acc.id === id ? { ...acc, checked: !acc.checked } : acc))
    setSelectedAccounts(newAccounts)
    // Clear inputs when all accounts are deselected
    const newSelectedCount = newAccounts.filter((a) => a.checked).length
    if (newSelectedCount === 0) {
      setBudgetAmount("")
      setPercentage("")
    }
  }

  const handleInputClick = () => {
    if (selectedCount === 0) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
  }

  const handleSubmit = () => {
    setShowSuccess(true)
  }

  const handleSuccessConfirm = () => {
    setShowSuccess(false)
    onBack()
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          请先选择账户
        </div>
      )}

      {/* 来源提示 */}
      {showSourceTip && source && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {source}
          <button onClick={() => setShowSourceTip(false)} className="ml-2 text-white/70 hover:text-white">
            <X className="w-4 h-4 inline" />
          </button>
        </div>
      )}

      {/* 成功提示弹窗 */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 w-[300px] text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 mb-4">已成功修改所选账户预算</p>
            <button onClick={handleSuccessConfirm} className="w-full py-2 bg-blue-500 text-white text-sm rounded-lg">
              确认
            </button>
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-medium text-gray-800">批量修改预算</h1>
      </header>

      {/* 步骤条 */}
      <div className="bg-white px-4 py-4 flex items-center justify-center gap-2">
        <div className="flex flex-col items-center">
          <div className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center ${selectedCount > 0 ? "bg-blue-500" : "bg-blue-500"}`}>
            {selectedCount > 0 ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              "1"
            )}
          </div>
          <span className={`text-xs mt-1 ${selectedCount > 0 ? "text-gray-800" : "text-blue-500"}`}>选择账户</span>
        </div>
        <div className={`w-12 h-px ${selectedCount > 0 ? "bg-blue-500" : "bg-gray-300"}`}></div>
        <div className="flex flex-col items-center">
          <div className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center ${selectedCount > 0 ? "bg-blue-500" : "bg-gray-300"}`}>2</div>
          <span className={`text-xs mt-1 ${selectedCount > 0 ? "text-blue-500" : "text-gray-400"}`}>设置预算</span>
        </div>
        <div className="w-12 h-px bg-gray-300"></div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs flex items-center justify-center">3</div>
          <span className="text-xs text-gray-400 mt-1">完成</span>
        </div>
      </div>

      {/* 内容区域 */}
      <main className="px-4 py-3 space-y-3 flex flex-col items-center pb-[90px]">
        {/* 已选账户 */}
        <div className="w-[361px] bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-800">已选账户</span>
            <span className="text-xs text-gray-400"><span className="text-blue-500">{selectedCount}</span>个</span>
          </div>
          <div className="space-y-3">
            {selectedAccounts.map((account) => (
              <div key={account.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => toggleAccount(account.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    account.checked ? "bg-blue-500 border-blue-500" : "border-gray-300"
                  }`}
                >
                  {account.checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div>
                  <p className="text-sm text-gray-800">{account.name}</p>
                  <p className="text-xs text-gray-400">当前预算: {account.budget}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500">
            重新选择账户
          </button>
        </div>

        {/* 预算设置 */}
        <div className={`w-[361px] bg-white rounded-lg p-4 ${selectedCount === 0 ? "opacity-50" : ""}`}>
          <span className="text-sm font-medium text-gray-800">预算设置</span>
          <div className="flex gap-2 mt-3 mb-4">
            <button
              onClick={() => selectedCount > 0 && setBudgetType("unified")}
              className={`flex-1 py-2 text-xs rounded-full border ${
                budgetType === "unified" ? "bg-gray-100 border-gray-300 text-gray-800" : "border-gray-200 text-gray-400"
              } ${selectedCount === 0 ? "cursor-not-allowed" : ""}`}
            >
              统一修改预算
            </button>
            <button
              onClick={() => selectedCount > 0 && setBudgetType("percentage")}
              className={`flex-1 py-2 text-xs rounded-full border ${
                budgetType === "percentage" ? "bg-gray-100 border-gray-300 text-gray-800" : "border-gray-200 text-gray-400"
              } ${selectedCount === 0 ? "cursor-not-allowed" : ""}`}
            >
              按比例调整
            </button>
          </div>
          {budgetType === "unified" ? (
            <div>
              <label className="text-xs text-gray-500 mb-2 block">新预算金额</label>
              <div 
                onClick={handleInputClick}
                className={`flex items-center border border-gray-200 rounded-lg px-3 py-2 ${selectedCount === 0 ? "bg-gray-50 cursor-not-allowed" : ""}`}
              >
                <span className="text-sm text-gray-400 mr-2">¥</span>
                <input
                  type="text"
                  placeholder="请输入金额"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  disabled={selectedCount === 0}
                  className={`flex-1 text-sm outline-none bg-transparent ${selectedCount === 0 ? "cursor-not-allowed" : ""}`}
                />
                <span className="text-sm text-gray-400 ml-2">/天</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs text-gray-500 mb-2 block">调整比例</label>
              <div 
                onClick={handleInputClick}
                className={`flex items-center border border-gray-200 rounded-lg px-3 py-2 ${selectedCount === 0 ? "bg-gray-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="text"
                  placeholder="如: +10 或 -20"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  disabled={selectedCount === 0}
                  className={`flex-1 text-sm outline-none bg-transparent ${selectedCount === 0 ? "cursor-not-allowed" : ""}`}
                />
                <span className="text-sm text-gray-400 ml-2">%</span>
              </div>
            </div>
          )}
          <button 
            className={`w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm ${selectedCount === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600"}`}
            disabled={selectedCount === 0}
          >
            提交
          </button>
        </div>

        {/* 风险提示 */}
        <div className="w-[361px] flex items-start gap-2 px-1">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-amber-600">批量修改预算可能影响投放稳定性，请确认调整策略</p>
        </div>
      </main>

      {/* 底部确认按钮 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[72px] bg-white border-t border-gray-200 px-4 flex items-center">
        <button onClick={handleSubmit} className="w-full py-3 bg-blue-500 text-white text-sm rounded-lg">
          确认��改
        </button>
      </div>
    </div>
  )
}
