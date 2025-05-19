import { Notify } from "quasar";

const errorNotify = ({
  message = "Algo ha salido mal",
  timeout = 10000,
  ...args
} = {}) => {
  Notify.create({
    message,
    group: false,
    type: "negative",
    timeout,
    actions: [
      {
        icon: "close",
        color: "white",
        handler: () => {
          /* ... */
        },
      },
    ],
    ...args,
  });
};
const succesNotify = ({
  message = "Algo ha salido bien",
  timeout = 1000,
  ...args
} = {}) => {
  Notify.create({
    message,
    group: false,
    type: "positive",
    timeout,
    actions: [
      {
        icon: "close",
        color: "white",
        handler: () => {
          /* ... */
        },
      },
    ],
    ...args,
  });
};
const createNotify = (props) => {
  return Notify.create(props);
};
export { errorNotify, succesNotify, createNotify };
