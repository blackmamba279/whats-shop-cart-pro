
-- Create user_carts table to store cart sessions
CREATE TABLE public.user_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For anonymous users
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, abandoned
  CONSTRAINT unique_user_cart UNIQUE (user_id),
  CONSTRAINT unique_session_cart UNIQUE (session_id)
);

-- Create cart_items table to store individual cart items
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES public.user_carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_carts
CREATE POLICY "Users can view their own carts" 
  ON public.user_carts 
  FOR SELECT 
  USING (auth.uid() = user_id OR session_id = current_setting('app.session_id', true));

CREATE POLICY "Users can create their own carts" 
  ON public.user_carts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR session_id = current_setting('app.session_id', true));

CREATE POLICY "Users can update their own carts" 
  ON public.user_carts 
  FOR UPDATE 
  USING (auth.uid() = user_id OR session_id = current_setting('app.session_id', true));

CREATE POLICY "Admins can view all carts" 
  ON public.user_carts 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ));

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart items" 
  ON public.cart_items 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.user_carts 
    WHERE user_carts.id = cart_items.cart_id 
    AND (user_carts.user_id = auth.uid() OR user_carts.session_id = current_setting('app.session_id', true))
  ));

CREATE POLICY "Users can manage their own cart items" 
  ON public.cart_items 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_carts 
    WHERE user_carts.id = cart_items.cart_id 
    AND (user_carts.user_id = auth.uid() OR user_carts.session_id = current_setting('app.session_id', true))
  ));

CREATE POLICY "Admins can manage all cart items" 
  ON public.cart_items 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  ));

-- Create function to update cart updated_at timestamp
CREATE OR REPLACE FUNCTION update_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_carts 
  SET updated_at = now() 
  WHERE id = NEW.cart_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update cart timestamp when items change
CREATE TRIGGER update_cart_timestamp
  AFTER INSERT OR UPDATE OR DELETE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION update_cart_updated_at();
