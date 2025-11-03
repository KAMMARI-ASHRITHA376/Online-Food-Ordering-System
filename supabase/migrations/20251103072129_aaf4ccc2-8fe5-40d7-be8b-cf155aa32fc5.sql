-- Allow users to cancel pending orders only
CREATE POLICY "Users can cancel pending orders"
ON orders FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status IN ('pending', 'cancelled'));

-- Prevent all deletes (orders should be retained for records)
CREATE POLICY "No order deletions"
ON orders FOR DELETE
USING (false);