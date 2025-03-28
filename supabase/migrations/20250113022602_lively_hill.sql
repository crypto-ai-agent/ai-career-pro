/*
  # Make Initial Admin User
  
  This migration updates the specified user to be an admin.
  
  1. Changes
    - Sets is_admin = true for user with email shayldonb@gmail.com
  
  2. Security
    - Only affects a single user
    - Maintains existing RLS policies
*/

UPDATE profiles 
SET is_admin = true
WHERE email = 'shayldonb@gmail.com';