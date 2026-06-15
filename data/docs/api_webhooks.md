# Webhooks

## Supported Events

- ticket.created
- ticket.updated
- user.created
- user.deleted
- subscription.updated

## Delivery

Webhooks are delivered using HTTPS POST requests.

## Retries

Failed deliveries are retried:

- 1 minute
- 5 minutes
- 15 minutes
- 1 hour

## Verification

Webhook signatures should be verified before processing.