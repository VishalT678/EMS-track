
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "00:00", avg: 7.2, min: 5.1 },
  { name: "02:00", avg: 6.8, min: 4.9 },
  { name: "04:00", avg: 6.5, min: 4.8 },
  { name: "06:00", avg: 7.0, min: 5.0 },
  { name: "08:00", avg: 9.8, min: 7.2 },
  { name: "10:00", avg: 9.5, min: 6.9 },
  { name: "12:00", avg: 9.2, min: 6.8 },
  { name: "14:00", avg: 8.7, min: 6.5 },
  { name: "16:00", avg: 9.0, min: 6.7 },
  { name: "18:00", avg: 10.2, min: 7.5 },
  { name: "20:00", avg: 8.5, min: 6.2 },
  { name: "22:00", avg: 7.8, min: 5.8 },
];

const ResponseTimeChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Response Times (minutes)</CardTitle>
        <CardDescription>Average and minimum response times throughout the day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => `${value}m`} />
            <Tooltip 
              formatter={(value) => [`${value} min`, undefined]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Bar 
              dataKey="avg" 
              name="Average Response" 
              fill="#457B9D" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="min" 
              name="Minimum Response" 
              fill="#A8DADC" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ResponseTimeChart;
