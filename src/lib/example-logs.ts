
export const exampleLogs = {
  simple: `
[2024-08-29T10:00:00Z] INFO: Starting up service...
[2024-08-29T10:00:05Z] INFO: User 'testuser' logged in.
[2024-08-29T10:00:10Z] ERROR: Failed to process user request.
Traceback (most recent call last):
  File "/app/services/payment_service.py", line 123, in process_payment
    user_subscription = user.get_subscription()
AttributeError: 'NoneType' object has no attribute 'get_subscription'
[2024-08-29T10:00:11Z] WARN: Transaction failed, retrying...
`,
  complex: `
[2024-08-29T11:00:00Z] [auth-service] INFO: Authentication request for user 'admin'.
[2024-08-29T11:00:01Z] [auth-service] DEBUG: Verifying credentials against primary user store.
[2024-08-29T11:00:02Z] [order-service] INFO: Received new order #12345 from user 'admin'.
[2024-08-29T11:00:03Z] [order-service] DEBUG: Validating order items.
[2024-08-29T11:00:04Z] [inventory-service] INFO: Requesting stock check for items [A, B, C].
[2024-08-29T11:00:05Z] [inventory-service] WARN: Connection to inventory database 'db-primary' timed out. Attempting to connect to replica 'db-replica-1'.
[2024-08-29T11:00:10Z] [inventory-service] ERROR: Failed to connect to any database replicas.
org.springframework.data.redis.RedisConnectionFailureException: Unable to connect to Redis; nested exception is io.lettuce.core.RedisConnectionException: Unable to connect to [redis-host:6379]
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$ExceptionTranslatingConnectionProvider.translateException(LettuceConnectionFactory.java:1619)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$ExceptionTranslatingConnectionProvider.getConnection(LettuceConnectionFactory.java:1523)
	at org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory$SharedConnection.getNativeConnection(LettuceConnectionFactory.java:1255)
	... 42 more
[2024-08-29T11:00:11Z] [order-service] ERROR: Failed to process order #12345 due to downstream failure in inventory-service.
`,
  confusing: `
[2024-08-29T12:00:00Z] INFO: System check OK.
[2024-08-29T12:01:00Z] DEBUG: payload: { "user_id": 1, "data": "value" }
[2024-08-29T12:02:00Z] INFO: Task completed successfully.
[2024-08-29T12:03:00Z] WARN: Deprecated feature 'old_api' used. It will be removed in a future version.
[2024-08-29T12:04:00Z] DEBUG: Checking cache for key 'config:123'.
[2024-08-29T12:05:00Z] INFO: Another task finished.
[2024-08-29T12:06:00Z] ERROR: An error occurred: 42. See logs for details.
[2024-08-29T12:07:00Z] INFO: Everything is fine.
[2024-08-29T12:08:00Z] DEBUG: Finalizing process.
`
};
