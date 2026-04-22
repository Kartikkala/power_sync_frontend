import useWebSocketLib from 'react-use-websocket';

// Handle CJS default export interop
const useWebSocket = useWebSocketLib.default || useWebSocketLib;
const ReadyState = useWebSocketLib.ReadyState;

// Connect directly to the WebSocket server on the same port as the REST API
const WS_URL = `ws://${window.location.hostname}:8080/ws/telemetry`;

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
