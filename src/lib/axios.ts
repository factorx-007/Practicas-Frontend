import { api, ApiClient } from './api';

// Export the api client as the default axios-style API for backward compatibility
export { api as default };
export { api };

// Re-export ApiClient for legacy imports
export { ApiClient };