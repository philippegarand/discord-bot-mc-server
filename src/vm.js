const { ComputeManagementClient } = require("@azure/arm-compute");
const { DefaultAzureCredential } = require("@azure/identity");
const { Buttons, VMPowerState } = require("./enums");
require("dotenv").config();

const { AZURE_SUBSCRIPTION_ID, AZURE_RESOURCE_GROUP, AZURE_VM_NAME } =
  process.env;

module.exports = {
  shutdown: async () => {
    const computeClient = getComputeClient();
    await computeClient.virtualMachines.beginDeallocate(
      AZURE_RESOURCE_GROUP,
      AZURE_VM_NAME
    );
  },

  restart: async () => {
    const computeClient = getComputeClient();
    await computeClient.virtualMachines.beginRestart(
      AZURE_RESOURCE_GROUP,
      AZURE_VM_NAME
    );
  },

  start: async () => {
    const computeClient = getComputeClient();
    await computeClient.virtualMachines.beginStart(
      AZURE_RESOURCE_GROUP,
      AZURE_VM_NAME
    );
  },

  getVMPowerStateToServerStatus: async () => {
    const computeClient = getComputeClient();
    var instance = await computeClient.virtualMachines.instanceView(
      AZURE_RESOURCE_GROUP,
      AZURE_VM_NAME
    );

    var powerState = instance.statuses.find((x) =>
      x.code.startsWith("PowerState")
    );

    var updatingProvisioningState = instance.statuses.some(
      (x) => x.code === "ProvisioningState/updating"
    );

    if (
      updatingProvisioningState &&
      powerState?.displayStatus !== VMPowerState.VMDeallocating
    ) {
      return global.lastButton === Buttons.Restart
        ? VMPowerState.VMRestarting
        : VMPowerState.VMStarting;
    }

    return powerState ? powerState.displayStatus : VMPowerState.VMUnknown;
  },
};

const getComputeClient = () => {
  return new ComputeManagementClient(
    new DefaultAzureCredential(),
    AZURE_SUBSCRIPTION_ID
  );
};
