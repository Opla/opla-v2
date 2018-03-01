/* eslint class-methods-use-this: 0 */
import { Controller } from "zoapp-backend";

class MetricsController extends Controller {
  getAll() {
    // TODO: return real metrics

    return {
      users: {
      },
      conversations: {
      },
      sessions: {
      },
      errors: {
      },
      responses: {
      },
    };
  }
}

export default MetricsController;
