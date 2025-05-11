
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIPredictionCardProps {
  title: string;
  prediction: string | number;
  confidence: number;
  icon?: React.ReactNode;
}

const AIPredictionCard = ({ title, prediction, confidence, icon }: AIPredictionCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon || <Brain className="h-4 w-4 text-primary" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{prediction}</div>
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
            <span>AI Confidence</span>
            <span>{Math.round(confidence * 100)}%</span>
          </div>
          <Progress 
            value={confidence * 100} 
            className="h-2"
            indicatorClassName={confidence > 0.7 ? "bg-green-500" : "bg-yellow-500"}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPredictionCard;
