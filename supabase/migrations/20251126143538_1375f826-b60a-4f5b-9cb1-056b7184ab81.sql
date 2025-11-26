-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE app_role AS ENUM ('admin', 'gestor', 'projetista', 'engenheiro', 'campo', 'cliente');
CREATE TYPE budget_status AS ENUM (
  'rascunho', 
  'em_elaboracao', 
  'aguardando_projetista', 
  'aguardando_engenheiro', 
  'aguardando_gestor', 
  'enviado_cliente', 
  'aprovado', 
  'aprovado_ressalvas', 
  'reprovado', 
  'cancelado', 
  'paralisado'
);
CREATE TYPE work_status AS ENUM (
  'planejamento',
  'aguardando_inicio',
  'em_execucao',
  'suspenso',
  'finalizado',
  'cancelado'
);
CREATE TYPE photo_category AS ENUM (
  'antes',
  'durante',
  'depois',
  'risco',
  'pendencia',
  'correcao',
  'material_aplicado'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create budgets table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_contact TEXT,
  local TEXT NOT NULL,
  description TEXT NOT NULL,
  initial_survey TEXT,
  technical_responsible UUID REFERENCES public.profiles(id),
  status budget_status NOT NULL DEFAULT 'rascunho',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Create budget_revisions table
CREATE TABLE public.budget_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(budget_id, revision_number)
);

ALTER TABLE public.budget_revisions ENABLE ROW LEVEL SECURITY;

-- Create works table
CREATE TABLE public.works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id),
  work_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status work_status NOT NULL DEFAULT 'planejamento',
  start_date DATE,
  planned_end_date DATE,
  actual_end_date DATE,
  technical_responsible UUID REFERENCES public.profiles(id),
  team_leader UUID REFERENCES public.profiles(id),
  art_number TEXT,
  os_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

-- Create checklists table
CREATE TABLE public.checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'inicial', 'tecnico', 'seguranca'
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_by UUID REFERENCES public.profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

-- Create checklist_items table
CREATE TABLE public.checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Create materials_expected table (from budget)
CREATE TABLE public.materials_expected (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  unit_price NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.materials_expected ENABLE ROW LEVEL SECURITY;

-- Create materials_approved table (from planning)
CREATE TABLE public.materials_approved (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  unit_price NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.materials_approved ENABLE ROW LEVEL SECURITY;

-- Create materials_used table (from execution)
CREATE TABLE public.materials_used (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  applied_date DATE NOT NULL,
  applied_by UUID NOT NULL REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.materials_used ENABLE ROW LEVEL SECURITY;

-- Create photos table
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  category photo_category NOT NULL,
  description TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID REFERENCES public.budgets(id) ON DELETE CASCADE,
  work_id UUID REFERENCES public.works(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  tags TEXT[],
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (budget_id IS NOT NULL OR work_id IS NOT NULL)
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create activities table (daily logs)
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  team_members TEXT[],
  weather TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create occurrences table (incidents, issues)
CREATE TABLE public.occurrences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL, -- 'baixa', 'media', 'alta', 'critica'
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolution TEXT,
  resolved_by UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.occurrences ENABLE ROW LEVEL SECURITY;

-- Create pendings table
CREATE TABLE public.pendings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  responsible UUID REFERENCES public.profiles(id),
  due_date DATE,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pendings ENABLE ROW LEVEL SECURITY;

-- Create logs table (audit trail)
CREATE TABLE public.logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for budgets
CREATE POLICY "Users can view related budgets"
  ON public.budgets FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    technical_responsible = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gestor')
  );

CREATE POLICY "Users can create budgets"
  ON public.budgets FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gestor') OR
    public.has_role(auth.uid(), 'projetista') OR
    public.has_role(auth.uid(), 'engenheiro')
  );

CREATE POLICY "Users can update own budgets"
  ON public.budgets FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gestor')
  );

-- RLS Policies for works
CREATE POLICY "Users can view related works"
  ON public.works FOR SELECT
  TO authenticated
  USING (
    technical_responsible = auth.uid() OR
    team_leader = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gestor') OR
    public.has_role(auth.uid(), 'campo')
  );

CREATE POLICY "Gestors can create works"
  ON public.works FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gestor')
  );

CREATE POLICY "Authorized users can update works"
  ON public.works FOR UPDATE
  TO authenticated
  USING (
    technical_responsible = auth.uid() OR
    team_leader = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'gestor')
  );

-- RLS Policies for other tables (simplified for now)
CREATE POLICY "Users can view related data"
  ON public.budget_revisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert related data"
  ON public.budget_revisions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Similar policies for other tables
CREATE POLICY "All authenticated can read" ON public.checklists FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.checklists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "All authenticated can update" ON public.checklists FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated can read" ON public.checklist_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.checklist_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "All authenticated can update" ON public.checklist_items FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated can read" ON public.materials_expected FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.materials_expected FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated can read" ON public.materials_approved FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.materials_approved FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated can read" ON public.materials_used FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.materials_used FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated can read" ON public.photos FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.photos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated can read" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.documents FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated can read" ON public.activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.activities FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated can read" ON public.occurrences FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.occurrences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "All authenticated can update" ON public.occurrences FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated can read" ON public.pendings FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write" ON public.pendings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "All authenticated can update" ON public.pendings FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated can read logs" ON public.logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated can write logs" ON public.logs FOR INSERT TO authenticated WITH CHECK (true);