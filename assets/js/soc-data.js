/* =========================================================
   Shared detection data — DING Golf capstone lab.
   Powers the homepage SOC console and the capstone
   interactive attack chain. Lab demo data, not live.
   ========================================================= */
window.SOC_STAGES = [
    {
        n: 1, phase: "Initial Access", title: "Phishing",
        time: "06:08",
        desc: "The victim opens a cloned login portal and submits her credentials.",
        cmd: "POST /verify  user=sarah.chen",
        siem: "Credential submission logged on the portal host.",
        rule: "101", level: 12,
        attack: "T1566.002", attackName: "Spearphishing Link",
        sev: "high",
        analyst: "Confirm the portal is attacker-controlled and flag the account for an immediate password reset."
    },
    {
        n: 2, phase: "Execution", title: "Auto-trigger",
        time: "06:08",
        desc: "A watcher script detects the new credential and launches the rest of the chain, hands-off.",
        cmd: "watcher.sh  →  fire attack",
        siem: "Attacker-side automation — no victim-host event yet.",
        rule: null, level: 0,
        attack: "T1059", attackName: "Command & Scripting",
        sev: "info",
        analyst: "No host signal at this point — exactly why portal-side logging matters for early warning."
    },
    {
        n: 3, phase: "Discovery", title: "Recon",
        time: "06:09",
        desc: "The attacker scans the subnet, finds the server, and confirms SMB is open.",
        cmd: "nmap -sV -p445 192.168.56.109",
        siem: "First inbound SMB logon appears on the server.",
        rule: "102", level: 4,
        attack: "T1046", attackName: "Network Service Scanning",
        sev: "info",
        analyst: "Low-severity on its own — record the source IP so later events correlate to it."
    },
    {
        n: 4, phase: "Credential Access", title: "Validation",
        time: "06:11",
        desc: "The phished password is validated against the server over SMB.",
        cmd: "crackmapexec smb … -u sarah.chen",
        siem: "Network logon (4624) from the recon IP; repeated tries trip the brute-force rule.",
        rule: "102 + 110", level: 10,
        attack: "T1078", attackName: "Valid Accounts",
        sev: "high",
        analyst: "The recon IP is now authenticating successfully — escalate; this is no longer noise."
    },
    {
        n: 5, phase: "Lateral Movement", title: "Exfiltration",
        time: "06:12",
        desc: "Using the validated credentials, the attacker browses an SMB share and copies confidential files.",
        cmd: "smbclient //…/DING_Confidential",
        siem: "Remote share access + file reads immediately after the suspicious logon.",
        rule: "100101 + 104", level: 12,
        attack: "T1039", attackName: "Data from Network Shared Drive",
        sev: "high",
        analyst: "Confirmed compromise — isolate the host, preserve logs, begin the incident timeline."
    },
    {
        n: 6, phase: "Impact", title: "Ransomware",
        time: "06:14",
        desc: "Demo files are renamed to .locked and a ransom note is dropped on both machines.",
        cmd: "ransomware_sim.py",
        siem: "FIM fires on the mass rename and the ransom note; the correlation rule confirms the full chain.",
        rule: "106 / 107 → 108", level: 15,
        attack: "T1486", attackName: "Data Encrypted for Impact",
        sev: "critical",
        analyst: "Critical — contain, block the source IP, and invoke the incident-response plan."
    }
];
