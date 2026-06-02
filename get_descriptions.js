const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ylaecdccfjxteajzfhcz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsYWVjZGNjZmp4dGVhanpmaGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDYzMDMsImV4cCI6MjA5MjI4MjMwM30.VFaZ_45Cl-jjpZ94yiQeFlMZplLTPx2-FIT8tHvIIuI');

async function run() {
  const { data, error } = await supabase.from('products').select('id, name, description');
  if (error) console.error(error);
  console.log(JSON.stringify(data, null, 2));
}
run();
