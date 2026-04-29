"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BatchBudgetPage() {
  const router = useRouter()
  const [budgetType, setBudgetType] = useState<"unified" | "percentage">("unified")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [percentage, setPercentage] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const [selectedAccounts, setSelectedAccounts] = useState([
    { id: 1, name: "品牌推广-A计划", budget: "¥5,000/天", checked: true },
    { id: 2, name: "效果转化-B计划", budget: "¥3,000/天", checked: true },
    { id: 3, name: "拉新活动-C计划", budget: "¥3,000/天", checked: true },
  ])

  const toggleAccount = (id: number) => {
    setSelectedAccounts(accounts =>
      accounts.map(acc =>
        acc.id === id ? { ...acc, checked: !acc.checked } : acc
      )
    )
  }

  const handleSubmit = () => {
    setShowSuccess(true)
  }

  const handleSuccessConfirm = () => {
    setShowSuccess(false)
    router.push("/account")
  }

  const selectedCount = selectedAccounts.filter(a => a.checked).length

  return (
    <div className="w-[393px] min-h-screen bg-gray-100 mx-auto relative pb-[72px] overflow-x-hidden">
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
            <button
              onClick={handleSuccessConfirm}
              className="w-full py-2 bg-blue-500 text-white text-sm rounded-lg"
            >
              确认
            </button>
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <Link href="/account" className="text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-medium text-gray-800">批量修改预算</h1>
      </header>

      {/* 步骤条 */}
      <div className="bg-white px-4 py-4 flex items-center justify-center gap-2">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs text-gray-500 mt-1">选择账户</span>
        </div>
        <div className="w-12 h-px bg-gray-300"></div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">2</div>
          <span className="text-xs text-amber-500 mt-1">设置预算</span>
        </div>
        <div className="w-12 h-px bg-gray-300"></div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs flex items-center justify-center">3</div>
          <span className="text-xs text-gray-400 mt-1">完成</span>
        </div>
      </div>

      {/* 内容区域 */}
      <main className="px-4 py-3 space-y-3 flex flex-col items-center">
        {/* 已选账户 */}
        <div className="w-[361px] bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-800">已选账户</span>
            <span className="text-xs text-gray-400">{selectedCount}个</span>
          </div>
          <div className="space-y-3">
            {selectedAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-b-0"
              >
                <button
                  onClick={() => toggleAccount(account.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    account.checked ? "bg-gray-800 border-gray-800" : "border-gray-300"
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
        <div className="w-[361px] bg-white rounded-lg p-4">
          <span className="text-sm font-medium text-gray-800">预算设置</span>
          
          {/* Tab切换 */}
          <div className="flex gap-2 mt-3 mb-4">
            <button
              onClick={() => setBudgetType("unified")}
              className={`flex-1 py-2 text-xs rounded-full border ${
                budgetType === "unified"
                  ? "bg-gray-100 border-gray-300 text-gray-800"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              统一修改预算
            </button>
            <button
              onClick={() => setBudgetType("percentage")}
              className={`flex-1 py-2 text-xs rounded-full border ${
                budgetType === "percentage"
                  ? "bg-gray-100 border-gray-300 text-gray-800"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              按比例调整
            </button>
          </div>

          {/* 输入区域 */}
          {budgetType === "unified" ? (
            <div>
              <label className="text-xs text-gray-500 mb-2 block">新预算金额</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-400 mr-2">¥</span>
                <input
                  type="text"
                  placeholder="请输入金额"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent"
                />
                <span className="text-sm text-gray-400 ml-2">/天</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs text-gray-500 mb-2 block">调整比例</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="如: +10 或 -20"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent"
                />
                <span className="text-sm text-gray-400 ml-2">%</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
          >
            提交
          </button>
        </div>

        {/* 风险提示 */}
        <div className="w-[361px] flex items-start gap-2 px-1">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-amber-600">批量修改预算可能影响投放稳定性，请确认调整策略</p>
        </div>
      </main>

      {/* 底部确认按钮 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[72px] bg-white border-t border-gray-200 px-4 flex items-center">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-500 text-white text-sm rounded-lg"
        >
          确认修改
        </button>
      </div>
    </div>
  )
}
