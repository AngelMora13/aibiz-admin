import moment from "moment-timezone";
const qDate = (...args) => {
  const timeZone = "America/Caracas";
  const qDate = class {
    constructor(fecha, format) {
      this.fecha = moment.tz(fecha, format, timeZone);
      return this;
    }
    get toDate() {
      return this.fecha.toDate();
    }

    format(mask) {
      this.fecha = this.fecha.format(mask);
      return this.fecha;
    }
    add(...args) {
      this.fecha = this.fecha.add(...args);
      return this;
    }
    startOf(type) {
      this.fecha = this.fecha.startOf(type);
      return this;
    }
    endOf(type) {
      this.fecha = this.fecha.endOf(type);
      return this;
    }
  };
  return new qDate(...args);
};

export { qDate };
