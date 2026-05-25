import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CHART_TOOLTIP_STYLE, bookCountFormatter } from "../../utils/chart";

interface MonthlyBarChartProps {
  data: { name: string; count: number; isCurrent: boolean }[];
  height?: number;
}

export function MonthlyBarChart({ data, height = 160 }: MonthlyBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        barSize={18}
        margin={{ top: 4, right: 4, bottom: 0, left: -24 }}
      >
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: "#A8968E" }}
        />
        <YAxis
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: "#A8968E" }}
        />
        <Tooltip
          cursor={false}
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={bookCountFormatter}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isCurrent ? "#E8825A" : "#DDD0BE"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
