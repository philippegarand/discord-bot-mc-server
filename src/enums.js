module.exports = {
  Buttons: {
    Start: "Start",
    Shutdown: "Shutdown",
    Restart: "Restart",
  },
  Commands: {
    Ping: "ping",
    ServerStatus: "server-status",
  },
  ServerStatus: {
    Starting: "starting",
    Restarting: "restarting",
    Up: "up",
    Down: "down",
    ShuttingDown: "shutting down",
    Unknown: "unknown",
  },
  VMPowerState: {
    VMStarting: "VM starting",
    VMRunning: "VM running",
    VMStopping: "VM stopping",
    VMStopped: "VM stopped",
    VMDeallocating: "VM deallocating",
    VMDeallocated: "VM deallocated",
    VMRestarting: "VM restarting",
    VMUnknown: "VM unknown",
  },
  VMPowerStateToServerStatus: {
    "VM starting": "starting",
    "VM running": "up",
    "VM stopping": "down",
    "VM stopped": "down",
    "VM deallocating": "shutting down",
    "VM deallocated": "down",
    "VM restarting": "restarting",
    "VM unknown": "unknown",
  },
};
