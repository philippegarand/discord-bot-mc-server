const { ComputeManagementClient } = require("@azure/arm-compute");
const { DefaultAzureCredential } = require("@azure/identity");
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
};

const getComputeClient = () => {
  return new ComputeManagementClient(
    new DefaultAzureCredential(),
    AZURE_SUBSCRIPTION_ID
  );
};
