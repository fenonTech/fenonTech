import { useEffect, useState } from 'react';
import { apiService } from '../services';
import type { WebhookPayload } from '../types';
import { useFinancial } from '../contexts';

export function useWebhooks() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastWebhook, setLastWebhook] = useState<WebhookPayload | null>(null);
  const { handleWebhookData } = useFinancial();

  // Função para processar webhooks recebidos
  const processWebhook = async (payload: WebhookPayload) => {
    try {
      setLastWebhook(payload);
      
      // Processar no context
      handleWebhookData(payload.event, payload.data);
      
      // Log para debug
      console.log('Webhook processado:', payload);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return { success: false, error };
    }
  };

  // Função para enviar dados para N8N
  const sendToN8N = async (event: string, data: any) => {
    try {
      const payload: WebhookPayload = {
        event: event as any,
        data,
        timestamp: new Date().toISOString(),
        source: 'meu-bolso-app'
      };

      const response = await apiService.sendToN8N(payload);
      return response;
    } catch (error) {
      console.error('Erro ao enviar para N8N:', error);
      return { success: false, message: 'Erro ao enviar para N8N' };
    }
  };

  // Simular conexão com N8N (em produção seria via WebSocket ou Server-Sent Events)
  useEffect(() => {
    // Aqui você configuraria a conexão real com N8N
    setIsConnected(true);
    
    // Cleanup
    return () => {
      setIsConnected(false);
    };
  }, []);

  return {
    isConnected,
    lastWebhook,
    processWebhook,
    sendToN8N,
  };
}