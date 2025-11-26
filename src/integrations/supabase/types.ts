export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          created_by: string
          date: string
          description: string
          id: string
          team_members: string[] | null
          weather: string | null
          work_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          description: string
          id?: string
          team_members?: string[] | null
          weather?: string | null
          work_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          description?: string
          id?: string
          team_members?: string[] | null
          weather?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_revisions: {
        Row: {
          budget_id: string
          created_at: string
          created_by: string
          description: string
          id: string
          revision_number: number
        }
        Insert: {
          budget_id: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          revision_number: number
        }
        Update: {
          budget_id?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          revision_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "budget_revisions_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          client_contact: string | null
          client_name: string
          created_at: string
          created_by: string
          description: string
          id: string
          initial_survey: string | null
          local: string
          status: Database["public"]["Enums"]["budget_status"]
          technical_responsible: string | null
          updated_at: string
        }
        Insert: {
          client_contact?: string | null
          client_name: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          initial_survey?: string | null
          local: string
          status?: Database["public"]["Enums"]["budget_status"]
          technical_responsible?: string | null
          updated_at?: string
        }
        Update: {
          client_contact?: string | null
          client_name?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          initial_survey?: string | null
          local?: string
          status?: Database["public"]["Enums"]["budget_status"]
          technical_responsible?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_technical_responsible_fkey"
            columns: ["technical_responsible"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          checked: boolean
          checklist_id: string
          created_at: string
          description: string
          id: string
          notes: string | null
        }
        Insert: {
          checked?: boolean
          checklist_id: string
          created_at?: string
          description: string
          id?: string
          notes?: string | null
        }
        Update: {
          checked?: boolean
          checklist_id?: string
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          completed: boolean
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          title: string
          type: string
          work_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          title: string
          type: string
          work_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          title?: string
          type?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklists_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          budget_id: string | null
          file_type: string
          filename: string
          id: string
          storage_path: string
          tags: string[] | null
          uploaded_at: string
          uploaded_by: string
          version: number
          work_id: string | null
        }
        Insert: {
          budget_id?: string | null
          file_type: string
          filename: string
          id?: string
          storage_path: string
          tags?: string[] | null
          uploaded_at?: string
          uploaded_by: string
          version?: number
          work_id?: string | null
        }
        Update: {
          budget_id?: string | null
          file_type?: string
          filename?: string
          id?: string
          storage_path?: string
          tags?: string[] | null
          uploaded_at?: string
          uploaded_by?: string
          version?: number
          work_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      materials_approved: {
        Row: {
          created_at: string
          id: string
          name: string
          quantity: number
          unit: string
          unit_price: number | null
          work_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          quantity: number
          unit: string
          unit_price?: number | null
          work_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          quantity?: number
          unit?: string
          unit_price?: number | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_approved_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      materials_expected: {
        Row: {
          budget_id: string
          created_at: string
          id: string
          name: string
          quantity: number
          unit: string
          unit_price: number | null
        }
        Insert: {
          budget_id: string
          created_at?: string
          id?: string
          name: string
          quantity: number
          unit: string
          unit_price?: number | null
        }
        Update: {
          budget_id?: string
          created_at?: string
          id?: string
          name?: string
          quantity?: number
          unit?: string
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_expected_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      materials_used: {
        Row: {
          applied_by: string
          applied_date: string
          created_at: string
          id: string
          name: string
          notes: string | null
          quantity: number
          unit: string
          work_id: string
        }
        Insert: {
          applied_by: string
          applied_date: string
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          quantity: number
          unit: string
          work_id: string
        }
        Update: {
          applied_by?: string
          applied_date?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          quantity?: number
          unit?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_used_applied_by_fkey"
            columns: ["applied_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_used_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      occurrences: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          resolution: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
          work_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: string
          resolution?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          title: string
          work_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          resolution?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "occurrences_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occurrences_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occurrences_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      pendings: {
        Row: {
          created_at: string
          created_by: string
          description: string
          due_date: string | null
          id: string
          resolution: string | null
          resolved: boolean
          resolved_at: string | null
          responsible: string | null
          work_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          due_date?: string | null
          id?: string
          resolution?: string | null
          resolved?: boolean
          resolved_at?: string | null
          responsible?: string | null
          work_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          due_date?: string | null
          id?: string
          resolution?: string | null
          resolved?: boolean
          resolved_at?: string | null
          responsible?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pendings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendings_responsible_fkey"
            columns: ["responsible"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendings_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          category: Database["public"]["Enums"]["photo_category"]
          description: string
          id: string
          latitude: number | null
          longitude: number | null
          storage_path: string
          uploaded_at: string
          uploaded_by: string
          work_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["photo_category"]
          description: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          storage_path: string
          uploaded_at?: string
          uploaded_by: string
          work_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["photo_category"]
          description?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      works: {
        Row: {
          actual_end_date: string | null
          art_number: string | null
          budget_id: string
          created_at: string
          id: string
          name: string
          os_number: string | null
          planned_end_date: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["work_status"]
          team_leader: string | null
          technical_responsible: string | null
          updated_at: string
          work_code: string
        }
        Insert: {
          actual_end_date?: string | null
          art_number?: string | null
          budget_id: string
          created_at?: string
          id?: string
          name: string
          os_number?: string | null
          planned_end_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["work_status"]
          team_leader?: string | null
          technical_responsible?: string | null
          updated_at?: string
          work_code: string
        }
        Update: {
          actual_end_date?: string | null
          art_number?: string | null
          budget_id?: string
          created_at?: string
          id?: string
          name?: string
          os_number?: string | null
          planned_end_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["work_status"]
          team_leader?: string | null
          technical_responsible?: string | null
          updated_at?: string
          work_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "works_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "works_team_leader_fkey"
            columns: ["team_leader"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "works_technical_responsible_fkey"
            columns: ["technical_responsible"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "gestor"
        | "projetista"
        | "engenheiro"
        | "campo"
        | "cliente"
      budget_status:
        | "rascunho"
        | "em_elaboracao"
        | "aguardando_projetista"
        | "aguardando_engenheiro"
        | "aguardando_gestor"
        | "enviado_cliente"
        | "aprovado"
        | "aprovado_ressalvas"
        | "reprovado"
        | "cancelado"
        | "paralisado"
      photo_category:
        | "antes"
        | "durante"
        | "depois"
        | "risco"
        | "pendencia"
        | "correcao"
        | "material_aplicado"
      work_status:
        | "planejamento"
        | "aguardando_inicio"
        | "em_execucao"
        | "suspenso"
        | "finalizado"
        | "cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "gestor",
        "projetista",
        "engenheiro",
        "campo",
        "cliente",
      ],
      budget_status: [
        "rascunho",
        "em_elaboracao",
        "aguardando_projetista",
        "aguardando_engenheiro",
        "aguardando_gestor",
        "enviado_cliente",
        "aprovado",
        "aprovado_ressalvas",
        "reprovado",
        "cancelado",
        "paralisado",
      ],
      photo_category: [
        "antes",
        "durante",
        "depois",
        "risco",
        "pendencia",
        "correcao",
        "material_aplicado",
      ],
      work_status: [
        "planejamento",
        "aguardando_inicio",
        "em_execucao",
        "suspenso",
        "finalizado",
        "cancelado",
      ],
    },
  },
} as const
