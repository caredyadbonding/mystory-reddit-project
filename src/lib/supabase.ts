import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://agpnhwjzrgjgczouhuhj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncG5od2p6cmdqZ2N6b3VodWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzM1OTYsImV4cCI6MjA3MDEwOTU5Nn0.kmYvlAmA9Zk8ekvMbuV-5oV2KKcs0g2oC6Nn1xMPzns'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface SurveyResponse {
  id?: string
  name: string
  email: string
  age?: number
  relationship: string
  duration: string
  typical_day: string
  difficulty_rating: number
  difficulty_reason: string
  emotional_challenge: string
  isolation_feeling: string
  relationship_learning: string
  connection_moment: string
  love_memory: string
  coping_methods: string
  talk_to_whom: string
  support_systems: string[]
  missing_support: string
  extra_hour: string
  lost_activity: string
  additional_sharing?: string
  created_at?: string
}