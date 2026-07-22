"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyRevenue } from "@/lib/revenue-report";

export function RevenueChart({ data }: { data: DailyRevenue[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data.map((d) => ({ ...d, dollars: d.cents / 100 }))}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} />
        <Bar dataKey="dollars" fill="var(--color-primary)" radius={4} />
      </BarChart>
    </ResponsiveContainer>
  );
}
