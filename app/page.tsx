"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ChevronDown, X, GripVertical, Search } from "lucide-react"

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

export default function VivoHomePage() {
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
            <button
              onClick={handleOpenSheet}
              className="text-sm text-blue-500"
            >
              自定义
            </button>
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
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[72px] bg-white border-t border-gray-200 px-4 flex items-center z-10">
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

      {/* 自定义指标弹层 */}
      {showMetricsSheet && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleCloseSheet}
          />

          {/* 弹层内容 */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[75%] bg-white rounded-t-xl z-50 flex flex-col">
            {/* 顶部标题栏 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="w-6" />
              <h3 className="text-base font-medium text-gray-800">自定义指标</h3>
              <button onClick={handleCloseSheet} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 搜索框 */}
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

            {/* 主体区域 - 左右两列 */}
            <div className="flex-1 flex overflow-hidden px-4">
              {/* 左侧 - 可选指标 */}
              <div className="flex-1 flex flex-col overflow-hidden pr-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-500">可选指标（{availableMetrics.length}）</span>
                </div>
                <div className="text-xs text-gray-400 mb-2">基础指标</div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {filteredMetrics.map((metric) => {
                    const isSelected = tempSelectedMetrics.some((m) => m.id === metric.id)
                    return (
                      <label
                        key={metric.id}
                        className="flex items-center gap-2 py-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleMetric(metric)}
                          disabled={!isSelected && tempSelectedMetrics.length >= maxMetrics}
                          className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{metric.name}</span>
                        {metric.hasInfo && (
                          <span className="text-gray-400 text-xs">?</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* 分隔线 */}
              <div className="w-px bg-gray-100" />

              {/* 右侧 - 已选指标 */}
              <div className="flex-1 flex flex-col overflow-hidden pl-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-orange-500">
                    已选指标（{tempSelectedMetrics.length}/{maxMetrics}）
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {tempSelectedMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="flex items-center justify-between py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-300" />
                        <span className="text-sm text-gray-700">{metric.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveMetric(metric.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500"
              >
                重置
              </button>
              <button
                onClick={handleSave}
                className="bg-gray-800 text-white text-sm px-6 py-2 rounded-full"
              >
                保存并应用
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
