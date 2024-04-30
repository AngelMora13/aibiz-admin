import { date } from "quasar";
const qDate = (...args) => {
  const dateClass = class {
    constructor(fecha, format, timezone = "T04:00:00.000Z") {
      this.fecha = date.extractDate(fecha, format);
      if (timezone) {
        this.fecha = new Date(`${this.format("YYYY-MM-DD")}${timezone}`);
      }
    }
    get toDate() {
      return this.fecha;
    }

    format(mask) {
      const fecha = date.formatDate(this.fecha, mask);
      return fecha;
    }

    subtract(options) {
      this.fecha = date.subtractFromDate(this.fecha, options);
      return this;
    }

    set(options) {
      this.fecha = date.adjustDate(this.fecha, options);
      return this;
    }
  };
  return new dateClass(...args);
};

export { qDate };
