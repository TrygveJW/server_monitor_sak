"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerBox = void 0;
const tslib_1 = require("tslib");
const ping_1 = tslib_1.__importDefault(require("ping"));
const dns_1 = tslib_1.__importDefault(require("dns"));
const enums_1 = require("./../helpers/enums");
class ServerBox {
    constructor(server) {
        this.status = enums_1.ServerStatus.NO_INTERNET;
        this.htmlRoot = null;
        this.statusText = null;
        this.statusBox = null;
        this.pingOK = false;
        this.domainOk = false;
        this.name = server.serverName;
        this.ip = server.serverIP;
        this.domain = server.serverDomain;
    }
    updateScreen() {
        this.checkDomainStatus();
        this.checkPingStatus();
    }
    checkDomainStatus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield dns_1.default.promises.resolve4(this.domain);
                this.domainOk = res.includes(this.ip);
            }
            catch (err) {
                //TODO:Maby this only will trigger when no internett
                this.domainOk = false;
            }
            this.updateDisplayedStatus();
        });
    }
    checkPingStatus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                //TODO:verefy this will stopp somtime when no answer
                let res = yield ping_1.default.promise.probe(this.ip, { timeout: 10 });
                this.pingOK = res.alive;
            }
            catch (error) {
                this.pingOK = false;
            }
        });
    }
    updateDisplayedStatus() {
        let newStatus;
        if (this.pingOK) {
            if (this.domainOk) {
                newStatus = enums_1.ServerStatus.ONLINE;
            }
            else {
                newStatus = enums_1.ServerStatus.DOMAIN_ERROR;
            }
        }
        else {
            newStatus = enums_1.ServerStatus.OFFLINE;
        }
        switch (newStatus) {
            case enums_1.ServerStatus.ONLINE:
                this.statusBox.style.background = "rgba(0,255,0)";
                this.statusText.innerHTML = "ONLINE";
                break;
            case enums_1.ServerStatus.OFFLINE:
                this.statusBox.style.background = "rgba(255,0,0)";
                this.statusText.innerHTML = "OFFLINE";
                break;
            // case ServerStatus.NO_INTERNET:
            //     this.statusBox.style.background = "rgba(0,0,0)"
            //     this.statusText.innerHTML = "NO INTERNET"
            //     break;
            case enums_1.ServerStatus.DOMAIN_ERROR:
                this.statusBox.style.background = "rgba(0,0,255)";
                this.statusText.innerHTML = "DOMAIN ERROR";
                break;
            default:
            // code block
        }
    }
    makePingBox(parent) {
        // make the grid box
        let rootElent = document.createElement("div");
        rootElent.className = 'grid-item';
        this.htmlRoot = rootElent;
        parent.appendChild(rootElent);
        // make the server info box #################
        let serverInf = document.createElement("div");
        serverInf.className = 'server-info';
        this.htmlRoot.appendChild(serverInf);
        let infTypes = document.createElement("div");
        infTypes.className = 'types';
        serverInf.appendChild(infTypes);
        let infoH1 = document.createElement("h2");
        infoH1.innerHTML = "Server";
        infTypes.appendChild(infoH1);
        let infoH2 = document.createElement("h2");
        infoH2.innerHTML = "IP";
        infTypes.appendChild(infoH2);
        let infoH3 = document.createElement("h2");
        infoH3.innerHTML = "Domain";
        infTypes.appendChild(infoH3);
        let col = document.createElement("div");
        serverInf.appendChild(col);
        for (let n = 0; n < 3; n++) {
            let tmp = document.createElement("h2");
            tmp.innerHTML = ":";
            col.appendChild(tmp);
        }
        let infvalues = document.createElement("div");
        infvalues.className = 'values';
        serverInf.appendChild(infvalues);
        let valuesH1 = document.createElement("h2");
        valuesH1.innerHTML = this.name;
        infvalues.appendChild(valuesH1);
        let valuesH2 = document.createElement("h2");
        valuesH2.innerHTML = this.ip;
        infvalues.appendChild(valuesH2);
        let valuesH3 = document.createElement("h2");
        valuesH3.innerHTML = this.domain;
        infvalues.appendChild(valuesH3);
        //#########################
        let serverStatus = document.createElement("div");
        serverStatus.className = 'server-status';
        this.statusBox = serverStatus;
        this.htmlRoot.appendChild(serverStatus);
        let statusH1 = document.createElement("h1");
        statusH1.innerHTML = "STATUS";
        serverStatus.appendChild(statusH1);
        let statusH2 = document.createElement("h1");
        statusH2.innerHTML = "NOT SET";
        this.statusText = statusH2;
        serverStatus.appendChild(statusH2);
    }
}
exports.ServerBox = ServerBox;
//# sourceMappingURL=PingBox.js.map