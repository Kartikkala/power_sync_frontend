#!/bin/bash
# Simulates an ESP/IoT device sending power readings to the backend
# Run this to generate fake telemetry so you can test billing

BASE_URL="http://localhost:8080/esp"
NODE_ID="Room_101"

echo "🔌 Simulating IoT device: $NODE_ID"
echo "   Sending 10 readings with increasing energy..."
echo ""

for i in $(seq 1 1000); do
  # Energy increases by 0.5 kWh per reading
  ENERGY=$(printf "%.3f" "$(echo "$i * 0.5" | bc -l)")
  VOLTAGE=$(printf "%.1f" "$(echo "230 + $((RANDOM % 10))" | bc)")
  CURRENT=$(printf "%.2f" "$(echo "0.30 + $((RANDOM % 20)) / 100" | bc -l)")
  POWER=$(printf "%.1f" "$(echo "$VOLTAGE * $CURRENT" | bc -l)")
  TIMESTAMP=$(date -d "+${i} hours" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -v+${i}H "+%Y-%m-%d %H:%M:%S")

  echo "  [$i/10] Energy: ${ENERGY} kWh | Power: ${POWER} W"

  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"nodeId\": \"$NODE_ID\",
      \"voltage\": $VOLTAGE,
      \"current\": $CURRENT,
      \"power\": $POWER,
      \"energy\": $ENERGY,
      \"timestamp\": \"$TIMESTAMP\"
    }")

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  if [ "$HTTP_CODE" != "200" ]; then
    echo "    ⚠️  HTTP $HTTP_CODE"
  fi

  sleep 0.5
done

echo ""
echo "✅ Done! 10 readings sent."
echo "   Total simulated energy: ~5.0 kWh"
echo ""
echo "👉 Next steps:"
echo "   1. Go to Billing page → click 'Generate Bills Now'"
echo "   2. Go to Transactions page to see the generated bill"
