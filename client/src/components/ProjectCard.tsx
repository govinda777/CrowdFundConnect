import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, calculatePercentage } from "@/lib/utils";

export interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  raised: number;
  goal: number;
  daysLeft: number;
  backers: number;
  category: string;
  imageColor?: string;
}

export default function ProjectCard({
  id,
  title,
  description,
  raised,
  goal,
  daysLeft,
  backers,
  category,
  imageColor = "from-purple-500 to-indigo-600"
}: ProjectCardProps) {
  const percentComplete = calculatePercentage(raised, goal);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-40 bg-gradient-to-r ${imageColor}`}></div>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{category}</Badge>
          {daysLeft <= 5 ? (
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
              <i className="fas fa-clock mr-1"></i> {daysLeft} dias restantes
            </Badge>
          ) : null}
        </div>
        
        <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{formatCurrency(raised)}</span>
            <span className="text-gray-600">{percentComplete}%</span>
          </div>
          <Progress value={percentComplete} className="h-2" />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{backers} apoiadores</span>
            <span>Meta: {formatCurrency(goal)}</span>
          </div>
        </div>
        
        <Link href={`/crowdfunding?id=${id}`}>
          <Button className="w-full">Ver Projeto</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
