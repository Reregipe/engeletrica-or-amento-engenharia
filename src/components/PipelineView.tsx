import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  Hammer, 
  CheckCircle2, 
  Book 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineStage {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  count?: number;
  status: "pending" | "active" | "completed";
}

const stages: PipelineStage[] = [
  {
    id: "orcamento",
    title: "Orçamento",
    icon: FileText,
    description: "Elaboração e aprovação",
    status: "pending",
  },
  {
    id: "planejamento",
    title: "Planejamento",
    icon: Calendar,
    description: "Cronograma e recursos",
    status: "pending",
  },
  {
    id: "execucao",
    title: "Execução",
    icon: Hammer,
    description: "Acompanhamento diário",
    status: "pending",
  },
  {
    id: "encerramento",
    title: "Encerramento",
    icon: CheckCircle2,
    description: "Finalização e pendências",
    status: "pending",
  },
  {
    id: "book",
    title: "Book Final",
    icon: Book,
    description: "Documentação completa",
    status: "pending",
  },
];

const PipelineView = () => {
  return (
    <Card className="shadow-lg border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Hammer className="h-6 w-6" />
          Pipeline de Obras
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="relative">
                <Card
                  className={cn(
                    "transition-all duration-300 hover:shadow-xl cursor-pointer border-2",
                    stage.status === "active" && "border-secondary shadow-lg scale-105",
                    stage.status === "completed" && "border-green-500 bg-green-50",
                    stage.status === "pending" && "border-muted hover:border-primary/50"
                  )}
                >
                  <CardContent className="p-4 text-center">
                    <div className={cn(
                      "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors",
                      stage.status === "active" && "bg-secondary text-secondary-foreground",
                      stage.status === "completed" && "bg-green-500 text-white",
                      stage.status === "pending" && "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-foreground">{stage.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{stage.description}</p>
                    {stage.count !== undefined && (
                      <Badge variant="secondary" className="mt-2">
                        {stage.count} ativo{stage.count !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
                
                {index < stages.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="w-4 h-0.5 bg-primary"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-semibold text-foreground">Fluxo rígido:</span> Cada etapa deve ser concluída antes de avançar para a próxima. 
            Somente orçamentos aprovados geram obras.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelineView;