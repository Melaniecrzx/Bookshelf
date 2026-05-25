import { useGoalsData } from "../hooks/useGoalsData";
import { PageHeader } from "../components/PageHeader";
import { AnnualGoalCard } from "../components/goals/AnnualGoalCard";
import { MonthlyBarChart } from "../components/charts/MonthlyBarChart";
import { MilestonesCard } from "../components/goals/MilestonesCard";
import { CURRENT_YEAR } from "../utils/date";

export function GoalsPage() {
  const {
    goal,
    setGoal,
    read,
    onTrack,
    currentPerWeek,
    neededPerWeek,
    monthlyData,
    milestones,
  } = useGoalsData();

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <PageHeader
        title="Goals"
        subtitle={`Your ${CURRENT_YEAR} reading objectives`}
      />

      <AnnualGoalCard
        goal={goal}
        setGoal={setGoal}
        read={read}
        onTrack={onTrack}
        currentPerWeek={currentPerWeek}
        neededPerWeek={neededPerWeek}
      />

      <section className="bg-sand-100 border border-sand-300 rounded-xl p-6 mb-6">
        <h2 className="font-serif text-lg font-bold text-ink-900 mb-5">
          Monthly Breakdown
        </h2>
        <MonthlyBarChart data={monthlyData} />
        <p className="text-xs font-sans text-ink-400 mt-2 text-right">
          Current month highlighted
        </p>
      </section>

      <MilestonesCard milestones={milestones} />
    </div>
  );
}
