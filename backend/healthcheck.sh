#!/bin/bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$STATUS" != "200" ]; then
  echo "LeadGateway API DOWN at $(date) - Status: $STATUS" >> /var/log/leadgateway-health.log
  # Add webhook here later
fi