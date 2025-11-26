import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Budget {
  id: string;
  client_name: string;
  local: string;
  description: string;
  status: string;
  created_at: string;
}

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [local, setLocal] = useState("");
  const [description, setDescription] = useState("");
  const [initialSurvey, setInitialSurvey] = useState("");

  useEffect(() => {
    checkAuth();
    fetchBudgets();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar orçamentos",
        description: error.message,
      });
    } else {
      setBudgets(data || []);
    }
    setLoading(false);
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("budgets").insert({
      client_name: clientName,
      client_contact: clientContact,
      local,
      description,
      initial_survey: initialSurvey,
      created_by: user.id,
      status: "rascunho",
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar orçamento",
        description: error.message,
      });
    } else {
      toast({
        title: "Orçamento criado com sucesso!",
      });
      setDialogOpen(false);
      // Reset form
      setClientName("");
      setClientContact("");
      setLocal("");
      setDescription("");
      setInitialSurvey("");
      fetchBudgets();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      rascunho: { label: "Rascunho", variant: "secondary" },
      em_elaboracao: { label: "Em Elaboração", variant: "default" },
      aguardando_projetista: { label: "Aguardando Projetista", variant: "outline" },
      aguardando_engenheiro: { label: "Aguardando Engenheiro", variant: "outline" },
      aguardando_gestor: { label: "Aguardando Gestor", variant: "outline" },
      enviado_cliente: { label: "Enviado ao Cliente", variant: "default" },
      aprovado: { label: "Aprovado", variant: "default" },
      aprovado_ressalvas: { label: "Aprovado c/ Ressalvas", variant: "default" },
      reprovado: { label: "Reprovado", variant: "destructive" },
      cancelado: { label: "Cancelado", variant: "destructive" },
      paralisado: { label: "Paralisado", variant: "destructive" },
    };

    const statusInfo = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const filteredBudgets = budgets.filter(
    (budget) =>
      budget.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
            <p className="text-muted-foreground">Gerencie todos os orçamentos do sistema</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Orçamento</DialogTitle>
                <DialogDescription>
                  Preencha os dados iniciais do orçamento
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBudget} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Nome do Cliente *</Label>
                  <Input
                    id="client-name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-contact">Contato do Cliente</Label>
                  <Input
                    id="client-contact"
                    type="tel"
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local">Local da Obra *</Label>
                  <Input
                    id="local"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initial-survey">Levantamento Inicial</Label>
                  <Textarea
                    id="initial-survey"
                    value={initialSurvey}
                    onChange={(e) => setInitialSurvey(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Criar Orçamento
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Budgets List */}
        {filteredBudgets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum orçamento encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Tente buscar com outros termos" : "Crie seu primeiro orçamento"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBudgets.map((budget) => (
              <Card 
                key={budget.id} 
                className="hover:shadow-xl transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    {getStatusBadge(budget.status)}
                  </div>
                  <CardTitle className="text-xl mt-2">{budget.client_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Local:</span> {budget.local}
                    </p>
                    <p className="text-muted-foreground line-clamp-2">
                      {budget.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Criado em {new Date(budget.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Budgets;