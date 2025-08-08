-- Add support for guest-created schedules
-- Make user_id optional and add creator name/email fields

ALTER TABLE schedules 
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE schedules 
  ADD COLUMN creator_name TEXT,
  ADD COLUMN creator_email TEXT;

-- Add constraint to ensure either user_id or creator_name is provided
ALTER TABLE schedules 
  ADD CONSTRAINT schedules_creator_check 
  CHECK (user_id IS NOT NULL OR creator_name IS NOT NULL);

-- Update RLS policies to allow guest creation
-- Replace the INSERT policy for schedules
DROP POLICY IF EXISTS "Users can create schedules" ON schedules;

CREATE POLICY "Anyone can create schedules" ON schedules
  FOR INSERT WITH CHECK (
    -- Either authenticated user creating their own schedule
    (auth.uid() = user_id AND creator_name IS NULL AND creator_email IS NULL)
    OR
    -- Or guest user providing creator info
    (user_id IS NULL AND creator_name IS NOT NULL)
  );

-- Update the UPDATE policy to include guest schedules
DROP POLICY IF EXISTS "Users can update their own schedules" ON schedules;

CREATE POLICY "Users can update their own schedules" ON schedules
  FOR UPDATE USING (
    -- Authenticated users can update their own schedules
    (auth.uid() = user_id)
    OR
    -- Guest schedules cannot be updated (or implement token-based editing if needed)
    FALSE
  );

-- Update the DELETE policy to include guest schedules  
DROP POLICY IF EXISTS "Users can delete their own schedules" ON schedules;

CREATE POLICY "Users can delete their own schedules" ON schedules
  FOR DELETE USING (
    -- Authenticated users can delete their own schedules
    (auth.uid() = user_id)
    OR
    -- Guest schedules cannot be deleted (or implement token-based deletion if needed)
    FALSE
  );

-- Update the SELECT policy for authenticated access
DROP POLICY IF EXISTS "Users can view their own schedules" ON schedules;

CREATE POLICY "Users can view their own schedules" ON schedules
  FOR SELECT USING (
    -- Authenticated users can view their own schedules
    auth.uid() = user_id
  );

-- Add index for creator_name and creator_email for performance
CREATE INDEX IF NOT EXISTS schedules_creator_name_idx ON schedules(creator_name);
CREATE INDEX IF NOT EXISTS schedules_creator_email_idx ON schedules(creator_email); 