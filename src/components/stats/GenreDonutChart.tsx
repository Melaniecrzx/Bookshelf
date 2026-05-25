import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const GENRE_COLORS = [
  "#C97C42", "#E4A76A", "#F0C89A", "#D4956E",
  "#E8B88A", "#F5D4B0", "#F5D4B0", "#FAE8D0",
];
const genreColor = (i: number) => GENRE_COLORS[Math.min(i, GENRE_COLORS.length - 1)];

interface GenreDonutChartProps {
  data: { name: string; count: number }[];
}

export function GenreDonutChart({ data }: GenreDonutChartProps) {
  return (
    <section className="bg-sand-100 border border-sand-300 rounded-xl p-6">
      <h2 className="font-serif text-lg font-bold text-ink-900 mb-6">
        Genres in your library
      </h2>
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="relative w-64 h-64 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                strokeWidth={0}
              >
                {data.map((_, i) => <Cell key={i} fill={genreColor(i)} />)}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#F5F0E8",
                  border: "1px solid #E0D4C3",
                  borderRadius: "8px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#2A1F14",
                }}
                formatter={(v) => {
                  const n = Number(v);
                  return [`${n} book${n > 1 ? "s" : ""}`, "Count"] as [string, string];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-serif text-4xl font-bold text-terra-500">{data.length}</span>
            <span className="text-xs text-ink-400 font-sans">genres</span>
          </div>
        </div>
        <ul className="flex flex-col gap-2 w-full">
          {data.map((entry, i) => (
            <li key={entry.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: genreColor(i) }} />
              <span className="text-sm text-ink-700 font-sans flex-1 truncate">{entry.name}</span>
              <span className="text-sm text-ink-400 font-sans">{entry.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
