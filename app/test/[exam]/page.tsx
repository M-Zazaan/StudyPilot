"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { SATTestRunner } from "@/components/test/sat-test-runner"
import { IELTSTestRunner } from "@/components/test/ielts-test-runner"
import { getMockTestFromPlan } from "@/lib/mock-tests"
import { getPlannedTest } from "@/lib/local-store"
import type { ExamId } from "@/lib/types"

export default function TestRunnerPage({ params }: { params: { exam: ExamId } }) {
  const sp = useSearchParams()
  const planId = sp.get("plan") || undefined

  const test = useMemo(() => {
    const plan = planId ? getPlannedTest(planId) : undefined
    return getMockTestFromPlan(params.exam, plan)
  }, [params.exam, planId])

  return (
    <div className="space-y-3">
      <header>
        <h1 className="text-pretty text-xl font-semibold">{params.exam.toUpperCase()} Practice</h1>
        <p className="text-muted-foreground">
          Familiar layout, real-time timer, flag questions, and a review when you submit.
        </p>
      </header>

      <Card className="overflow-hidden">
        {params.exam === "sat" ? <SATTestRunner test={test} /> : <IELTSTestRunner test={test} />}
      </Card>
    </div>
  )
}
