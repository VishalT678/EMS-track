
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Trauma", value: 35, color: "#E63946" },
  { name: "Cardiac", value: 25, color: "#457B9D" },
  { name: "Respiratory", value: 15, color: "#A8DADC" },
  { name: "Stroke", value: 10, color: "#1D3557" },
  { name: "Other", value: 15, color: "#f8c05e" },
];

const EmergencyTypesChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Types</CardTitle>
        <CardDescription>Distribution of emergency calls by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmergencyTypesChart;
