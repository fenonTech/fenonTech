import React from 'react';
import { useWebhooks } from '../../hooks';
import './WebhookStatus.css';

const WebhookStatus: React.FC = () => {
  const { isConnected, lastWebhook } = useWebhooks();

  return (
    <div className="webhook-status">
      <div className="status-indicator">
        <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
        <span className="status-text">
          {isConnected ? 'N8N Conectado' : 'N8N Desconectado'}
        </span>
      </div>
      
      {lastWebhook && (
        <div className="last-webhook">
          <h4>Último Webhook:</h4>
          <div className="webhook-info">
            <span className="webhook-event">{lastWebhook.event}</span>
            <span className="webhook-time">
              {new Date(lastWebhook.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookStatus;