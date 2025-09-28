-- Create table for storing user calculation results
CREATE TABLE public.user_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id TEXT,
  result_type TEXT NOT NULL CHECK (result_type IN ('SGPA', 'CGPA')),
  branch TEXT NOT NULL,
  semester TEXT NOT NULL,
  grade_data JSONB NOT NULL,
  calculated_value DECIMAL(4,2) NOT NULL,
  result_status TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own results" 
ON public.user_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own results" 
ON public.user_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own results" 
ON public.user_results 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own results" 
ON public.user_results 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_results_updated_at
  BEFORE UPDATE ON public.user_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_user_results_user_id ON public.user_results(user_id);
CREATE INDEX idx_user_results_timestamp ON public.user_results(timestamp DESC);