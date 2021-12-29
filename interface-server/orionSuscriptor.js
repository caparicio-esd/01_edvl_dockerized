const axios = require("axios").default;
let suscription = null;
const { ORION_PORT, NODE_SERVER_PORT, DOCKER_HOST } = require("./constants");

const entities = ["Sensor"];
const data = {
  description: "Notify Sensors",
  subject: { entities: entities.map((e) => ({ idPattern: ".*", type: e })) },
  notification: {
    http: {
      url: `${DOCKER_HOST}:${NODE_SERVER_PORT}/subscriptions`,
    },
  },
};
const headers = { "Content-Type": "application/json" };

class Suscription {
  static description = "Notify Sensors";
  static suscription = null;

  static async setSuscription() {
    await axios
      .post(`${DOCKER_HOST}:${ORION_PORT}/v2/subscriptions/`, { ...data }, { ...headers })
      .then((res) => {
        console.log();
      })
      .catch(this.errorHandler);
  }
  static async checkSuscription() {
    await axios
      .get(`${DOCKER_HOST}:${ORION_PORT}/v2/subscriptions/`)
      .then(({ data }) => {
        this.suscription = data && data.length > 0 ? data[0].id : null;
      })
      .catch(this.errorHandler);
  }
  static async checkOrSetSuscription() {
    await this.checkSuscription();
    console.log(this.suscription);
    if (!this.suscription) {
      await this.setSuscription();
    }
  }
  static errorHandler(err) {
    console.error(err);
  }
}

module.exports = Suscription;
