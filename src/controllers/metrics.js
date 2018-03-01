/* eslint class-methods-use-this: 0 */
import { Controller } from "zoapp-backend";

class MetricsController extends Controller {
  getAll() {
    // TODO: return real metrics

    return {
      users: {
        count: 123,
      },
      conversations: {
        count: 1200,
        messages_count: 4320,
        // messages per conversation/number of conversations
        average: 3.6,
      },
      sessions: {
        duration: 5000, // ms
      },
      errors: {
        rate: 0.23, // percentage
      },
      responses: {
        speed: 40, // ms
      },
    };
  }
}

export default MetricsController;
