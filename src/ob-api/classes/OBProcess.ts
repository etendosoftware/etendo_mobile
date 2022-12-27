import { OBRest } from "obrest";
import DefaultParams from "../constants/parameters";

export default class OBProcess {
  //Nombre del proceso a ejecutar
  processName;
  // ID
  processId;
  // clase java completa
  processClass;
  // ventana desde donde se ejecuta el proceso
  windowId;

  constructor(processName, processId, processClass, windowId) {
    this.processName = processName;
    this.processId = processId;
    this.processClass = processClass;
    this.windowId = windowId;
  }

  async callProcess(data) {
    try {
      // FIXME: user OBRest.getInstance().callWebService() when parameters are supported.
      const axios = OBRest.getInstance().getAxios();
      const response = await axios.request({
        params: {
          [DefaultParams.KERNEL_PROCESS_ID_PARAM]: this.processId,
          [DefaultParams.KERNEL_ACTION_PARAM]: this.processClass,
          [DefaultParams.WINDOW_ID]: this.windowId
        },
        data: data,
        method: "POST",
        url: "com.smf.securewebservices.kernel/org.openbravo.client.kernel"
      });

      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Deprectaded. use call Process
   * @param {*} data
   */
  async callRawProcess(data) {
    this.callProcess(data);
  }
}
