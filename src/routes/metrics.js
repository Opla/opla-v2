import { CommonRoutes } from "zoapp-backend";

class MetricsRoutes extends CommonRoutes {
  constructor(zoapp) {
    super(zoapp.extensions);

    this.getAll = this.getAll.bind(this);
  }

  getAll() {
    return this.controller.getMetrics().getAll();
  }
}

export default MetricsRoutes;
