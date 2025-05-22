
import { supabase } from '../../integrations/supabase/client';
import { pagaditoService } from '../../services/pagadito';

// This is a mock API endpoint for handling Pagadito webhooks
// In a real application, this would be a serverless function or an endpoint on your server
export async function handlePagaditoWebhook(req, res) {
  // Get the signature from the request header
  const signature = req.headers['x-pagadito-signature'];
  
  try {
    // Validate the signature
    if (!pagaditoService.validateWebhook(signature, req.body)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const { 
      event_type, 
      transaction_id,
      status,
      amount
    } = req.body;
    
    // Handle different types of events
    if (event_type === 'payment.success') {
      // Update the order status
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'processing',
        })
        .eq('transaction_id', transaction_id);
        
      if (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ error: 'Failed to update order status' });
      }
      
      return res.status(200).json({ success: true });
    } 
    else if (event_type === 'payment.failed') {
      // Update the order status
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
        })
        .eq('transaction_id', transaction_id);
        
      if (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ error: 'Failed to update order status' });
      }
      
      return res.status(200).json({ success: true });
    }
    else {
      // Unhandled event type
      console.log(`Unhandled event type: ${event_type}`);
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
