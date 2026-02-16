# API & SDK Reference

This guide explains how to integrate your applications with Circuit Breaker using the Client API.

## Client API

The Circuit Breaker API exposes a public endpoint for clients (SDKs, mobile apps, frontends) to fetch the current feature flag configuration.

### Endpoint

`GET /api/v1/client/config`

### Authentication

You must provide a valid **API Key** in the request headers.

- **Header**: `x-api-key`
- **Value**: Your generated API Key (from the Admin Dashboard).

### Request Example

```bash
curl -X GET http://localhost:3000/api/v1/client/config \
  -H "x-api-key: YOUR_API_KEY"
```

### Response Format

The API returns a JSON object where keys are the Flag Keys and values are the evaluated configurations.

```json
{
  "enable-dark-mode": true,
  "new-checkout-flow": {
    "type": "PERCENTAGE",
    "percentage": 50
  },
  "holiday-promo": {
    "type": "TIME_BASED",
    "startDate": "2023-12-01T00:00:00.000Z",
    "endDate": "2023-12-31T23:59:59.999Z"
  }
}
```

## SDK Integration

_(Coming Soon)_

We are currently building SDKs for:

- Angular (`ngx-circuit`)
- Node.js
- React

In the meantime, you can easily fetch the configuration using any HTTP client and implement your own evaluation logic based on the returned JSON.
