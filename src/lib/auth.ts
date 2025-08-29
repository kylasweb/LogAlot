// This is a mock authentication module.
// In a real application, you would use a library like NextAuth.js
// and integrate with a proper authentication provider.

// For demonstration purposes, we'll simulate a user from a mock token.
// In a real scenario, this would be parsed from a request header or cookie.

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

/**
 * Parses a demo session token to get user information.
 * In a real app, this would involve JWT verification or session lookup.
 * @returns The user object or null if not authenticated.
 */
export function getUser(): User | null {
  // For this demo, we'll always return a SUPER_ADMIN user.
  // To test non-admin views, you can change the role here.
  return {
    id: "user_123",
    name: "Admin User",
    email: "admin@example.com",
    role: "SUPER_ADMIN",
  };
}
