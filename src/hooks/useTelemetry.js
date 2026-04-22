import useWebSocketLib from 'react-use-websocket';

// Handle CJS default export interop
const useWebSocket = useWebSocketLib.default || useWebSocketLib;
const ReadyState = useWebSocketLib.ReadyState;

// Use relative path so the Vite proxy handles the WebSocket connection
const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/telemetry`;

export function useTelemetry() {
  const { lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  return {
    telemetry: lastJsonMessage,
    isConnected: readyState === ReadyState.OPEN,
  };
}
