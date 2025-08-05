import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xttfvefqxhcrcfxczubl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dGZ2ZWZxeGhjcmNmeGN6dWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDcyNjMsImV4cCI6MjA2ODI4MzI2M30.Z9t7SHRHj2aVH70bXSdazlikitL7PtMQTpxCIXrdP1c'

export const supabase = createClient(supabaseUrl, supabaseKey)
