export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          id: number
          post_id: number
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: number
          post_id: number
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: number
          post_id?: number
          author_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          id: number
          author_id: string
          title: string
          content: string | null
          is_published: boolean
          created_at: string
          slug: string | null
          tsv: unknown | null
        }
        Insert: {
          id?: number
          author_id: string
          title: string
          content?: string | null
          is_published?: boolean
          created_at?: string
          slug?: string | null
        }
        Update: {
          id?: number
          author_id?: string
          title?: string
          content?: string | null
          is_published?: boolean
          created_at?: string
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: number
          tag_id: number
        }
        Insert: {
          post_id: number
          tag_id: number
        }
        Update: {
          post_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      daily_visitors: {
        Row: {
          id: number
          visitor_id: string
          visit_date: string
        }
        Insert: {
          id?: number
          visitor_id: string
          visit_date: string
        }
        Update: {
          id?: number
          visitor_id?: string
          visit_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_daily_visitor_count: {
        Args: Record<string, never>
        Returns: number
      }
      get_total_visitor_count: {
        Args: Record<string, never>
        Returns: number
      }
      search_posts: {
        Args: {
          keyword: string
        }
        Returns: Database['public']['Tables']['posts']['Row'][]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Additional utility types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type Profile = Tables<'profiles'>
export type Post = Tables<'posts'>
export type Tag = Tables<'tags'>
export type Comment = Tables<'comments'>
export type PostTag = Tables<'post_tags'>

// Extended types with relationships
export type PostWithAuthor = Post & {
  profiles: Profile
}

export type PostWithAuthorAndTags = Post & {
  profiles: Profile
  post_tags: (PostTag & {
    tags: Tag
  })[]
}

export type CommentWithAuthor = Comment & {
  profiles: Profile
}