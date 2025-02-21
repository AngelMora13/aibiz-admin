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
const momentDate = (...args) => {
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
const momentDateFull = (...args) => {
  const timeZone = "America/Caracas";

  const momentDate = class {
    constructor(fecha, format, strict = false, formatOptonal) {
      this.fecha = moment.tz(fecha, format, strict, timeZone);
      if (formatOptonal && !this.isValid) {
        this.fecha = moment.tz(fecha, null, timeZone);
      }
    }
  };
  /**
   * @param {boolean=} withTime - Retorna el formato con fecha
   */
  const clientDate = new momentDate(...args);
  return clientDate.fecha;
};
export { qDate, momentDate, momentDateFull };
