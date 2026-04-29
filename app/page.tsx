"use client"

import { useState } from "react"
import { Bell, ChevronDown, X, GripVertical, Search, Shield, FileText, Settings, HelpCircle, Info, LogOut, ChevronRight, ChevronLeft } from "lucide-react"

// 页面类型
type PageType = "home" | "account" | "profile" | "batchBudget" | "login"

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
  const [previousPage, setPreviousPage] = useState<PageType>("profile")

  // 跳转到批量设置预算页面
  const goToBatchBudget = (source: string = "") => {
    setBatchBudgetSource(source)
    setCurrentPage("batchBudget")
  }

  // 跳转到登录页
  const goToLogin = () => {
    setPreviousPage(currentPage)
    setCurrentPage("login")
  }

  // 登录成功后跳转到首页
  const handleLogin = () => {
    setCurrentPage("home")
  }

  // 从登录页返回
  const handleLoginBack = () => {
    setCurrentPage(previousPage)
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
        return <ProfilePage onLogout={goToLogin} />
      case "batchBudget":
        return (
          <BatchBudgetPage
            source={batchBudgetSource}
            onBack={() => setCurrentPage("account")}
          />
        )
      case "login":
        return <LoginPage onLogin={handleLogin} onBack={handleLoginBack} />
      default:
        return <HomePage goToBatchBudget={goToBatchBudget} />
    }
  }

  return (
    <div className="w-[393px] h-[844px] bg-gray-100 mx-auto relative overflow-hidden shadow-xl">
      {renderPage()}
      {currentPage !== "batchBudget" && currentPage !== "login" && renderTabBar()}
    </div>
  )
}

// ==================== 首页组件 ====================
function HomePage({ goToBatchBudget }: { goToBatchBudget: (source: string) => void }) {
  const [showMetricsSheet, setShowMetricsSheet] = useState(false)
  const [selectedMetrics, setSelectedMetrics] = useState(defaultSelectedMetrics)
  const [tempSelectedMetrics, setTempSelectedMetrics] = useState(defaultSelectedMetrics)
  const [searchQuery, setSearchQuery] = useState("")
  
  // 消息通知状态
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  
  // 日期筛选状态
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState("今天")
  const dateOptions = ["今天", "昨天", "近7天", "本周", "本月", "上月"]
  
  // 账户选择状态
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState("全部账户概况")
  
  // 账户数据
  const accountData: Record<string, { totalBalance: number; availableBalance: number }> = {
    "全部账户概况": { totalBalance: 12890.00, availableBalance: 8650.00 },
    "品牌推广-A计划": { totalBalance: 5000.00, availableBalance: 1755.00 },
    "效果转化-B计划": { totalBalance: 8000.00, availableBalance: 110.00 },
    "拉新活动-C计划": { totalBalance: 1000.00, availableBalance: 50.00 },
  }
  const accountOptions = Object.keys(accountData)
  const currentAccountData = accountData[selectedAccount]
  
  // 指标数据（按账户）
  type MetricData = Record<string, Record<string, number>>
  const metricDataByAccount: MetricData = {
    "全部账户概况": { "消耗（元）": 12085, "展示数": 45000, "点击数": 3290, "点击率": 7.31, "平均千次展现费用（元）": 268.56, "转化数": 500, "平均点击单价（元）": 3.67, "激活消耗": 8500, "现金消耗": 3585, "平均转化成本": 24.17 },
    "品牌推广-A计划": { "消耗（元）": 3245, "展示数": 12000, "点击数": 890, "点击率": 7.42, "平均千次展现费用（元）": 270.42, "转化数": 120, "平均点击单价（元）": 3.65, "激活消耗": 2200, "现金消耗": 1045, "平均转化成本": 27.04 },
    "效果转化-B计划": { "消耗（元）": 7890, "展示数": 28000, "点击数": 2100, "点击率": 7.5, "平均千次展现费用（元）": 281.79, "转化数": 340, "平均点击单价（元）": 3.76, "激活消耗": 5500, "现金消耗": 2390, "平均转化成本": 23.21 },
    "拉新活动-C计划": { "消耗（元）": 950, "展示数": 5000, "点击数": 300, "点击率": 6.0, "平均千次展现费用（元）": 190.0, "转化数": 40, "平均点击单价（元）": 3.17, "激活消耗": 800, "现金消耗": 150, "平均转化成本": 23.75 },
  }
  
  // 获取趋势数据点数
  const getDataPointCount = (range: string): number => {
    switch (range) {
      case "今天": return 1
      case "昨天": return 1
      case "近7天": return 7
      case "本周": return 7
      case "本月": return 30
      case "上月": return 30
      default: return 7
    }
  }
  
  // 生成模拟趋势数据
  const generateTrendData = (baseValue: number, points: number): number[] => {
    const data: number[] = []
    for (let i = 0; i < points; i++) {
      const variance = baseValue * 0.2 * (Math.random() - 0.5)
      data.push(Math.round((baseValue + variance) * 100) / 100)
    }
    return data
  }
  
  // 获取当前指标数据
  const getCurrentMetricValue = (metricName: string): number => {
    const accountMetrics = metricDataByAccount[selectedAccount] || metricDataByAccount["全部账户概况"]
    return accountMetrics[metricName] || 0
  }
  
  // 获取当前指标趋势数据
  const getMetricTrendData = (metricName: string): number[] => {
    const baseValue = getCurrentMetricValue(metricName)
    const points = getDataPointCount(selectedDateRange)
    return generateTrendData(baseValue, points)
  }
  
  // 消息数据
  const notifications = [
    { id: 1, account: "品牌推广-A计划", spent: 3245, budget: 5000 },
    { id: 2, account: "效果转化-B计划", spent: 7890, budget: 8000 },
    { id: 3, account: "拉新活动-C计划", spent: 950, budget: 1000 },
  ]
  
  // 一键已读
  const handleMarkAllRead = () => {
    setHasUnread(false)
  }

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
    <div className="h-full flex flex-col overflow-hidden">
      {/* 顶部导航 - 固定 */}
      <header className="bg-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <div className="text-sm font-medium text-gray-800">vivo应用商店超管</div>
            <div className="text-xs text-blue-500">当前组织</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowNotificationPanel(true)}
            className="relative"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
            <span className="text-xs text-gray-400">...</span>
          </div>
        </div>
      </header>

      {/* 内容区域 - 可滚动 */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3 flex flex-col items-center pb-[72px] custom-scrollbar">
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
          <div className="relative">
            <button 
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-1 mb-3"
            >
              <span className="text-sm text-gray-600">{selectedAccount === "全部账户概况" ? "全部账户" : selectedAccount}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showAccountDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowAccountDropdown(false)} 
                />
                <div className="absolute left-0 top-full bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-40 min-w-[160px]">
                  {accountOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedAccount(option)
                        setShowAccountDropdown(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm ${
                        selectedAccount === option 
                          ? "text-blue-500 bg-blue-50" 
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-medium text-gray-800">¥{currentAccountData.totalBalance.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-sm text-gray-600">{currentAccountData.totalBalance.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">总余额</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm text-gray-600">{currentAccountData.availableBalance.toFixed(2)}</span>
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
            <div className="relative">
              <button 
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center gap-1"
              >
                <span className="text-sm text-gray-500">{selectedDateRange}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showDateDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowDateDropdown(false)} 
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-40 min-w-[100px]">
                    {dateOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedDateRange(option)
                          setShowDateDropdown(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${
                          selectedDateRange === option 
                            ? "text-blue-500 bg-blue-50" 
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={handleOpenSheet} className="text-sm text-blue-500">
              自定义
            </button>
          </div>
        </div>

        {/* 指标图表区域 - 纵向滚动 */}
        {selectedMetrics.length === 0 ? (
          /* 无选中指标 - 显示提示 */
          <div className="bg-white rounded-xl w-[361px] h-[140px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">暂无数据</div>
              <button onClick={handleOpenSheet} className="text-blue-500 text-sm">
                请选择指标
              </button>
            </div>
          </div>
        ) : (
          /* 指标卡片列表 - 纵向排列 */
          <div className="w-[361px] space-y-3">
            {selectedMetrics.map((metric) => {
              const trendData = getMetricTrendData(metric.name)
              const currentValue = getCurrentMetricValue(metric.name)
              const isMoneyMetric = metric.name.includes("元")
              const isRateMetric = metric.name.includes("率")
              
              return (
                <div key={metric.id} className="bg-white rounded-xl w-[361px] p-4">
                  {/* 顶部：指标名称 + 当前数值 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-800">{metric.name}</span>
                    <span className="text-lg font-medium text-blue-500">
                      {isMoneyMetric ? "¥" : ""}{currentValue.toLocaleString()}{isRateMetric ? "%" : ""}
                    </span>
                  </div>
                  
                  {/* 折线图区域 */}
                  <div className="h-[70px] relative">
                    {/* SVG折线图 */}
                    <svg className="w-full h-full" viewBox="0 0 320 70" preserveAspectRatio="none">
                      {/* 背景网格线 */}
                      <line x1="0" y1="23" x2="320" y2="23" stroke="#f0f0f0" strokeWidth="1" />
                      <line x1="0" y1="46" x2="320" y2="46" stroke="#f0f0f0" strokeWidth="1" />
                      
                      {/* 折线路径 */}
                      {(() => {
                        const maxVal = Math.max(...trendData)
                        const minVal = Math.min(...trendData)
                        const range = maxVal - minVal || 1
                        const points = trendData.map((val, i) => {
                          const x = trendData.length > 1 ? (i / (trendData.length - 1)) * 320 : 160
                          const y = 65 - ((val - minVal) / range) * 55
                          return `${x},${y}`
                        }).join(" ")
                        
                        // 填充区域路径
                        const areaPath = `M0,65 L${trendData.map((val, i) => {
                          const x = trendData.length > 1 ? (i / (trendData.length - 1)) * 320 : 160
                          const y = 65 - ((val - minVal) / range) * 55
                          return `${x},${y}`
                        }).join(" L")} L320,65 Z`
                        
                        return (
                          <>
                            {/* 填充区域 */}
                            <path d={areaPath} fill="url(#blueGradient)" opacity="0.3" />
                            {/* 折线 */}
                            <polyline
                              points={points}
                              fill="none"
                              stroke="#1677FF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* 数据点 */}
                            {trendData.map((val, i) => {
                              const x = trendData.length > 1 ? (i / (trendData.length - 1)) * 320 : 160
                              const y = 65 - ((val - minVal) / range) * 55
                              return (
                                <circle
                                  key={i}
                                  cx={x}
                                  cy={y}
                                  r="3"
                                  fill="white"
                                  stroke="#1677FF"
                                  strokeWidth="2"
                                />
                              )
                            })}
                          </>
                        )
                      })()}
                      {/* 渐变定义 */}
                      <defs>
                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#1677FF" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#1677FF" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* 消息通知页面（全屏覆盖） */}
      {showNotificationPanel && (
        <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-[393px] bg-gray-100 z-50 flex flex-col">
          {/* 顶部导航 */}
          <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <button 
              onClick={() => setShowNotificationPanel(false)}
              className="flex items-center gap-1 text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">返回</span>
            </button>
            <h1 className="text-base font-medium text-gray-800">消息通知</h1>
            <button 
              onClick={handleMarkAllRead}
              className="text-sm text-blue-500"
            >
              一键已读
            </button>
          </header>
          
          {/* 消息内容区域 */}
          <main className="flex-1 overflow-y-auto p-4">
            <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${hasUnread ? "" : "opacity-60"}`}>
              {/* 消息类型标签 */}
              <div className="flex items-center gap-2 mb-3">
                {hasUnread && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded">预算撞线预警</span>
              </div>
              
              {/* 消息标题 */}
              <h4 className={`text-sm font-medium mb-2 ${hasUnread ? "text-gray-800" : "text-gray-500"}`}>
                预算即将耗尽
              </h4>
              
              {/* 消息描述 */}
              <p className={`text-xs mb-4 ${hasUnread ? "text-gray-600" : "text-gray-400"}`}>
                3个账户预算即将耗尽，请及时调整预算
              </p>
              
              {/* 账户明细 */}
              <div className="space-y-3 mb-4">
                {notifications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className={hasUnread ? "text-gray-700" : "text-gray-400"}>{item.account}</span>
                    <span className={hasUnread ? "text-gray-500" : "text-gray-400"}>
                      已消耗 ¥{item.spent.toLocaleString()} / 预算 ¥{item.budget.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* 操作按钮 */}
              <button 
                onClick={() => {
                  setShowNotificationPanel(false)
                  goToBatchBudget("来自消息通知")
                }}
                className="w-full py-2.5 text-sm text-white bg-blue-500 rounded-lg"
              >
                去调整预算
              </button>
            </div>
          </main>
        </div>
      )}

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
  // 原始账户数据
  const allAccounts = [
    { id: 1, name: "品牌推广-A计划", roi: 2.35, status: "投放中", isActive: true, budget: 5000, spent: 3245, tags: ["品牌���广", "高ROI账户"] },
    { id: 2, name: "效果转化-B计划", roi: 1.82, status: "投放中", isActive: true, budget: 8000, spent: 7890, tags: ["效果转化"] },
    { id: 3, name: "拉新活动-C计划", roi: 0.95, status: "已暂停", isActive: false, budget: 3000, spent: 0, tags: ["拉新活动", "低消耗测试"] },
    { id: 4, name: "品牌推广-D计划", roi: 3.12, status: "投放中", isActive: true, budget: 10000, spent: 6500, tags: ["品牌推广", "高ROI账户"] },
  ]

  // 筛选面板状态
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [selectedTime, setSelectedTime] = useState("今天")
  const [selectedTags, setSelectedTags] = useState<string[]>(["不限标签"])
  const [selectedSort, setSelectedSort] = useState("花费最高")

  // 搜索状态
  const [isSearching, setIsSearching] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [recentSearches] = useState(["品牌推广A", "转化计划B"])

  // 时间选项
  const timeOptions = ["今天", "昨天", "近7天", "本周", "本月", "上月", "自定义时间"]
  // 标签选项
  const tagOptions = ["不限标签", "品牌推广", "效果转化", "拉新活动", "高ROI账户", "低消耗测试"]
  // 排序选项
  const sortOptions = ["花费最高", "花费最低", "ROI最高", "ROI最低", "点击率最高", "转化率最高", "最新创建", "最近活跃"]

  // 切换标签选择
  const toggleTag = (tag: string) => {
    if (tag === "不限标签") {
      setSelectedTags(["不限标签"])
    } else {
      const newTags = selectedTags.filter(t => t !== "不限标签")
      if (newTags.includes(tag)) {
        const filtered = newTags.filter(t => t !== tag)
        setSelectedTags(filtered.length === 0 ? ["不限标签"] : filtered)
      } else {
        setSelectedTags([...newTags, tag])
      }
    }
  }

  // 重置筛选
  const resetFilter = () => {
    setSelectedTime("今天")
    setSelectedTags(["不限标签"])
    setSelectedSort("花费最高")
  }

  // 过滤和排序账户
  const getFilteredAccounts = () => {
    let filtered = [...allAccounts]
    
    // 搜索过滤
    if (searchKeyword) {
      filtered = filtered.filter(acc => acc.name.toLowerCase().includes(searchKeyword.toLowerCase()))
    }
    
    // 标签过滤
    if (!selectedTags.includes("不限标签")) {
      filtered = filtered.filter(acc => acc.tags.some(tag => selectedTags.includes(tag)))
    }
    
    // 排序
    switch (selectedSort) {
      case "花费最高":
        filtered.sort((a, b) => b.spent - a.spent)
        break
      case "花费最低":
        filtered.sort((a, b) => a.spent - b.spent)
        break
      case "ROI最高":
        filtered.sort((a, b) => b.roi - a.roi)
        break
      case "ROI最低":
        filtered.sort((a, b) => a.roi - b.roi)
        break
    }
    
    return filtered
  }

  const filteredAccounts = getFilteredAccounts()

  // 搜索状态UI
  if (isSearching) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <header className="bg-white px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索账户名称"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-sm outline-none"
              />
              {searchKeyword && (
                <button onClick={() => setSearchKeyword("")}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsSearching(false)
                setSearchKeyword("")
              }}
              className="text-sm text-[#1677FF]"
            >
              取消
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-3 pb-[72px] custom-scrollbar">
          {searchKeyword === "" ? (
            <div className="w-[361px]">
              <div className="text-xs text-gray-500 mb-2">最近搜索</div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchKeyword(item)}
                    className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-[361px] space-y-3">
              {filteredAccounts.length === 0 ? (
                <div className="text-center text-gray-400 py-8 text-sm">暂无匹配的账户</div>
              ) : (
                filteredAccounts.map((account) => {
                  const progress = account.budget > 0 ? Math.min((account.spent / account.budget) * 100, 100) : 0
                  return (
                    <div key={account.id} className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{account.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${account.isActive ? "bg-blue-50 text-blue-500" : "bg-gray-100 text-gray-400"}`}>
                          {account.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-xs text-gray-400">ROI：</span>
                        <span className="text-xs text-gray-700 font-medium">{account.roi.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">预算：</span>
                          <span className="text-gray-700">¥{account.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">已消耗：</span>
                          <span className="text-blue-500 font-medium">¥{account.spent.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-3 w-full h-[6px] bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${account.isActive ? "bg-[#1677FF]" : "bg-gray-300"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-base font-medium text-gray-800">投放账户</h1>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3 flex flex-col items-center pb-[72px] custom-scrollbar">
        <div className="w-[361px] flex items-center gap-2">
          <button
            onClick={() => setIsSearching(true)}
            className="flex-1 bg-white rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-200"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">搜索账户名称</span>
          </button>
          <button 
            onClick={() => setShowFilterSheet(true)}
            className="bg-white rounded-lg px-3 py-2 text-sm text-gray-600 border border-gray-200 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选
          </button>
        </div>
        <div className="w-[361px] space-y-3">
          {filteredAccounts.map((account) => {
            const progress = account.budget > 0 ? Math.min((account.spent / account.budget) * 100, 100) : 0
            return (
              <div key={account.id} className="bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{account.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${account.isActive ? "bg-blue-50 text-blue-500" : "bg-gray-100 text-gray-400"}`}>
                    {account.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-xs text-gray-400">ROI：</span>
                  <span className="text-xs text-gray-700 font-medium">{account.roi.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">预算：</span>
                    <span className="text-gray-700">¥{account.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">已消耗：</span>
                    <span className="text-blue-500 font-medium">¥{account.spent.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-3 w-full h-[6px] bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${account.isActive ? "bg-[#1677FF]" : "bg-gray-300"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )
          })}
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

      {/* 筛选面板 Bottom Sheet */}
      {showFilterSheet && (
        <>
          {/* 遮罩 */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowFilterSheet(false)}
          />
          {/* 面板 */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[80%] bg-white rounded-t-xl z-50 flex flex-col animate-slide-up">
            {/* 标题区 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="w-6" />
              <span className="text-base font-medium text-gray-800">筛选条件</span>
              <button onClick={() => setShowFilterSheet(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {/* 时间筛选 */}
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">时间范围</h4>
                <div className="flex flex-wrap gap-2">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-1.5 text-xs rounded-full border ${
                        selectedTime === time 
                          ? "bg-[#1677FF] text-white border-[#1677FF]" 
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* 标签筛选 */}
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">标签</h4>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 text-xs rounded-full border ${
                        selectedTags.includes(tag) 
                          ? "bg-[#1677FF] text-white border-[#1677FF]" 
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 排序方式 */}
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">排序方式</h4>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSelectedSort(sort)}
                      className={`px-3 py-1.5 text-xs rounded-full border ${
                        selectedSort === sort 
                          ? "bg-[#1677FF] text-white border-[#1677FF]" 
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 底部操作区 */}
            <div className="px-4 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={resetFilter}
                className="flex-1 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="flex-1 py-2.5 text-sm text-white bg-[#1677FF] rounded-lg"
              >
                确定
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ==================== 个人中心组件 ====================
function ProfilePage({ onLogout }: { onLogout: () => void }) {
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
    <div className="h-full flex flex-col overflow-hidden">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
        <h1 className="text-base font-medium text-gray-800">个人中心</h1>
        <Settings className="w-5 h-5 text-gray-400" />
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3 flex flex-col items-center pb-[72px] custom-scrollbar">
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
              onClick={item.isLogout ? onLogout : undefined}
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

// ==================== 登录页组件 ====================
function LoginPage({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [rememberPassword, setRememberPassword] = useState(false)
  const [autoLogin, setAutoLogin] = useState(false)

  const isFormValid = account.trim() !== "" && password.trim() !== ""

  const handleLogin = () => {
    if (isFormValid) {
      onLogin()
    }
  }

  return (
    <div className="h-full bg-gray-100 flex flex-col overflow-hidden">
      {/* 顶部导航 */}
      <header className="bg-gray-100 px-4 py-3 flex items-center flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-600">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">登录</span>
        </button>
      </header>

      {/* 内容区 */}
      <main className="flex-1 flex flex-col items-center px-4 pt-12 overflow-y-auto custom-scrollbar">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1677FF] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">V</span>
          </div>
          <span className="text-lg font-medium text-gray-800">vivo营销</span>
        </div>

        {/* 标题 */}
        <h1 className="text-base text-[#1677FF] mb-8">账号密码登录</h1>

        {/* 表单 */}
        <div className="w-[361px] space-y-4">
          {/* 账号输入 */}
          <div className="border-b border-gray-200 py-3">
            <input
              type="text"
              placeholder="请输入账号"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* 密码输入 */}
          <div className="border-b border-gray-200 py-3">
            <input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* 记住密码 & 自动登录 */}
          <div className="flex items-center justify-between py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                onClick={() => setRememberPassword(!rememberPassword)}
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  rememberPassword ? "bg-[#1677FF] border-[#1677FF]" : "border-gray-300"
                }`}
              >
                {rememberPassword && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-xs text-gray-500">记住密码</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">自动登录</span>
              <button
                onClick={() => setAutoLogin(!autoLogin)}
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  autoLogin ? "bg-[#1677FF]" : "bg-gray-300"
                }`}
              >
                <div 
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    autoLogin ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 登录按钮 */}
          <button
            onClick={handleLogin}
            disabled={!isFormValid}
            className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
              isFormValid 
                ? "bg-[#1677FF] text-white" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            登录
          </button>

          {/* 底部链接 */}
          <div className="flex items-center justify-between pt-2">
            <button className="text-xs text-[#1677FF]">忘记密码？</button>
            <button className="text-xs text-[#1677FF]">注册账号</button>
          </div>
        </div>
      </main>

      {/* 底部文字 */}
      <footer className="py-6 text-center">
        <span className="text-xs text-gray-400">vivo营销平台</span>
      </footer>
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
    <div className="h-full flex flex-col overflow-hidden relative">
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
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-medium text-gray-800">批量修改预算</h1>
      </header>

      {/* 步骤条 */}
      <div className="bg-white px-4 py-4 flex items-center justify-center gap-2 flex-shrink-0">
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
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3 flex flex-col items-center pb-[90px] custom-scrollbar">
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
          <p className="text-xs text-amber-600">��量修改预算可能影响投放稳定性，请确认调整策略</p>
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
