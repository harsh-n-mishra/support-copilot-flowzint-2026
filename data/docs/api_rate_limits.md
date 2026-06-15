# API Rate Limits

## Starter

100 requests per minute

## Professional

1000 requests per minute

## Enterprise

Custom contract limits

## Exceeded Limits

The API returns:

429 Too Many Requests

## Best Practices

- Implement retry logic
- Respect Retry-After headers
- Use request batching where possible