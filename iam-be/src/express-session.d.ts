import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    authParams?: string;
    // Add more session fields here as needed
  }
}
