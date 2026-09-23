function hash(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function pick(key, pairs) {
  return pairs[hash(key) % pairs.length];
}

export const EXPANSIONS = {
  HIS: 'Hospital Information System',
  EMR: 'Electronic Medical Record',
  EHR: 'Electronic Health Record',
  PHR: 'Personal Health Record',
  PACS: 'Picture Archiving and Communication System',
  LIS: 'Laboratory Information System',
  RIS: 'Radiology Information System',
  CIS: 'Clinical Information System',
  NIS: 'Nursing Information System',
  CPOE: 'Computerized Physician Order Entry',
  CDSS: 'Clinical Decision Support System',
  ADT: 'Admit Discharge Transfer',
  MPI: 'Master Patient Index',
  DICOM: 'Digital Imaging and Communications in Medicine',
  HL7: 'Health Level Seven',
  FHIR: 'Fast Healthcare Interoperability Resources',
  IHE: 'Integrating the Healthcare Enterprise',
  'ICD-10': 'International Classification of Diseases, 10th Revision',
  SNOMED: 'Systematized Nomenclature of Medicine',
  LOINC: 'Logical Observation Identifiers Names and Codes',
  CPT: 'Current Procedural Terminology',
  DRG: 'Diagnosis Related Group',
  RFID: 'Radio Frequency Identification',
  RTLS: 'Real-Time Location System',
  CMMS: 'Computerized Maintenance Management System',
  ORM: 'Order Message',
  ORU: 'Observation Result',
  ACK: 'Acknowledgement',
  NACK: 'Negative Acknowledgement',
  EDR: 'Endpoint Detection and Response',
  IDS: 'Intrusion Detection System',
  IPS: 'Intrusion Prevention System',
  WAF: 'Web Application Firewall',
  DDoS: 'Distributed Denial of Service',
  CVE: 'Common Vulnerabilities and Exposures',
  DLP: 'Data Loss Prevention',
  MAR: 'Medication Administration Record',
  eMAR: 'Electronic Medication Administration Record',
  ADC: 'Automated Dispensing Cabinet',
  NTP: 'Network Time Protocol',
  CRL: 'Certificate Revocation List',
  OCSP: 'Online Certificate Status Protocol',
  CMDB: 'Configuration Management Database',
  SIEM: 'Security Information and Event Management',
  SOC: 'Security Operations Center',
  MFA: 'Multi-Factor Authentication',
  SSO: 'Single Sign-On',
  LDAP: 'Lightweight Directory Access Protocol',
  RBAC: 'Role-Based Access Control',
  ACL: 'Access Control List',
  PKI: 'Public Key Infrastructure',
  OAuth: 'Open Authorization',
  SAML: 'Security Assertion Markup Language',
  OpenID: 'OpenID authentication',
  UAT: 'User Acceptance Testing',
  RTO: 'Recovery Time Objective',
  RPO: 'Recovery Point Objective',
  SAN: 'Storage Area Network',
  NAS: 'Network Attached Storage',
  RAID: 'Redundant Array of Independent Disks',
  LUN: 'Logical Unit Number',
  HBA: 'Host Bus Adapter',
  iSCSI: 'Internet Small Computer Systems Interface',
  NIC: 'Network Interface Card',
  VLAN: 'Virtual Local Area Network',
  PoE: 'Power over Ethernet',
  SSID: 'Service Set Identifier',
  OTP: 'One-Time Password',
  MTTR: 'Mean Time To Repair',
  MTBF: 'Mean Time Between Failures',
  IOPS: 'Input/Output Operations Per Second',
  DBA: 'Database Administrator',
  BIOS: 'Basic Input/Output System',
  UEFI: 'Unified Extensible Firmware Interface',
  CAB: 'Change Advisory Board',
  APM: 'Application Performance Monitoring',
  SLO: 'Service Level Objective',
  SLI: 'Service Level Indicator',
  NAT: 'Network Address Translation',
  DMZ: 'Demilitarized Zone',
  CNAME: 'Canonical Name',
  TTL: 'Time To Live',
  UPS: 'Uninterruptible Power Supply',
  PDU: 'Power Distribution Unit',
  CRAC: 'Computer Room Air Conditioner',
  KVM: 'Keyboard Video Mouse',
  IPMI: 'Intelligent Platform Management Interface',
  iLO: 'Integrated Lights-Out',
  iDRAC: 'Integrated Dell Remote Access Controller',
  BMC: 'Baseboard Management Controller',
  MDT: 'Microsoft Deployment Toolkit',
  SCCM: 'System Center Configuration Manager',
  MDM: 'Mobile Device Management',
  BYOD: 'Bring Your Own Device',
  VoIP: 'Voice over Internet Protocol',
  SIP: 'Session Initiation Protocol',
  PBX: 'Private Branch Exchange',
  IVR: 'Interactive Voice Response',
  ACD: 'Automatic Call Distribution',
  QoS: 'Quality of Service',
  RSVP: 'please reply',
  KPI: 'Key Performance Indicator',
  SOP: 'Standard Operating Procedure',
  CC: 'Carbon Copy',
  BCC: 'Blind Carbon Copy',
  FYI: 'For Your Information',
  EOD: 'End of Day',
  RACI: 'Responsible, Accountable, Consulted, Informed',
  CAPA: 'Corrective and Preventive Action',
  AOB: 'Any Other Business',
  COB: 'Close of Business',
  EOB: 'End of Business',
  ETA: 'Estimated Time of Arrival',
  ETD: 'Estimated Time of Departure',
  TBA: 'To Be Announced',
  TBD: 'To Be Determined',
  'N/A': 'Not Applicable',
  WIP: 'Work in Progress',
  POC: 'Point of Contact',
  SME: 'Subject Matter Expert',
  PMO: 'Project Management Office',
  SLA: 'Service Level Agreement',
  OLA: 'Operational Level Agreement',
  PIP: 'Performance Improvement Plan',
  DSCP: 'Differentiated Services Code Point',
  WAN: 'Wide Area Network',
  LAN: 'Local Area Network',
  MAN: 'Metropolitan Area Network',
  MPLS: 'Multiprotocol Label Switching',
  'SD-WAN': 'Software-Defined Wide Area Network',
  BGP: 'Border Gateway Protocol',
  OSPF: 'Open Shortest Path First',
  ARP: 'Address Resolution Protocol',
  ICMP: 'Internet Control Message Protocol',
  TCP: 'Transmission Control Protocol',
  UDP: 'User Datagram Protocol',
  TLS: 'Transport Layer Security',
  HTTPS: 'Hypertext Transfer Protocol Secure',
  HTTP: 'Hypertext Transfer Protocol',
  FTP: 'File Transfer Protocol',
  SFTP: 'SSH File Transfer Protocol',
  SMB: 'Server Message Block',
  NFS: 'Network File System',
  CIFS: 'Common Internet File System',
  RDP: 'Remote Desktop Protocol',
  SSH: 'Secure Shell',
  SNMP: 'Simple Network Management Protocol',
  NTLM: 'NT LAN Manager',
  SPN: 'Service Principal Name',
  GPO: 'Group Policy Object',
  OU: 'Organizational Unit',
  GUID: 'Globally Unique Identifier',
  UPN: 'User Principal Name',
  CSR: 'Certificate Signing Request',
  HSTS: 'HTTP Strict Transport Security',
  JWT: 'JSON Web Token',
  WSUS: 'Windows Server Update Services',
  rsop: 'Resultant Set of Policy',
  RSOP: 'Resultant Set of Policy',
  WEF: 'Windows Event Forwarding',
  IOC: 'Indicator of Compromise',
  IOA: 'Indicator of Attack',
  'SHA-256': 'Secure Hash Algorithm 256',
  MD5: 'Message Digest 5',
  ASR: 'Attack Surface Reduction',
  DEP: 'Data Execution Prevention',
  ASLR: 'Address Space Layout Randomization',
  WDAC: 'Windows Defender Application Control',
  TPM: 'Trusted Platform Module',
  PCR: 'Platform Configuration Register',
  MBAM: 'Microsoft BitLocker Administration and Monitoring',
  FIPS: 'Federal Information Processing Standards',
  HSM: 'Hardware Security Module',
  KMS: 'Key Management Service',
  CMK: 'Customer Master Key',
  SMART: 'Self-Monitoring, Analysis and Reporting Technology',
  SSD: 'Solid State Drive',
  HDD: 'Hard Disk Drive',
  NVMe: 'Non-Volatile Memory Express',
  SATA: 'Serial ATA',
  SAS: 'Serial Attached SCSI',
  JBOD: 'Just a Bunch of Disks',
  VMDK: 'Virtual Machine Disk',
  VHD: 'Virtual Hard Disk',
  DRS: 'Distributed Resource Scheduler',
  NUMA: 'Non-Uniform Memory Access',
  LACP: 'Link Aggregation Control Protocol',
  IGMP: 'Internet Group Management Protocol',
  mDNS: 'Multicast DNS',
  LLMNR: 'Link-Local Multicast Name Resolution',
  WINS: 'Windows Internet Name Service',
  AXFR: 'Authoritative Zone Transfer',
  IXFR: 'Incremental Zone Transfer',
  TSIG: 'Transaction Signature',
  DNSSEC: 'Domain Name System Security Extensions',
  RRSIG: 'Resource Record Signature',
  DoH: 'DNS over HTTPS',
  DoT: 'DNS over TLS',
  PTR: 'Pointer Record',
  SOA: 'Start of Authority',
  SPF: 'Sender Policy Framework',
  DKIM: 'DomainKeys Identified Mail',
  DMARC: 'Domain-based Message Authentication, Reporting and Conformance',
  NDR: 'Non-Delivery Report',
  DSN: 'Delivery Status Notification',
  OST: 'Offline Storage Table',
  PST: 'Personal Storage Table'
};

const ACRONYM_KIND = {
  system: [
    'EMR', 'HIS', 'PACS', 'LIS', 'RIS', 'CIS', 'NIS', 'CPOE', 'CDSS', 'EHR', 'PHR',
    'CMMS', 'EDR', 'IDS', 'IPS', 'WAF', 'DLP', 'SIEM', 'SSO', 'MFA', 'SAN', 'NAS',
    'RAID', 'BIOS', 'UEFI', 'APM', 'SCCM', 'MDM', 'MDT', 'iLO', 'iDRAC', 'BMC',
    'IPMI', 'PBX', 'IVR', 'ACD', 'VoIP', 'WSUS', 'MBAM', 'KMS', 'ADT', 'MPI',
    'RTLS', 'CMDB', 'WEF'
  ],
  protocol: [
    'DICOM', 'HL7', 'FHIR', 'IHE', 'NTP', 'LDAP', 'OAuth', 'SAML', 'OpenID',
    'iSCSI', 'SIP', 'TCP', 'UDP', 'TLS', 'HTTP', 'HTTPS', 'FTP', 'SFTP', 'SMB',
    'NFS', 'CIFS', 'RDP', 'SSH', 'SNMP', 'BGP', 'OSPF', 'ARP', 'ICMP', 'NTLM',
    'DNSSEC', 'DoH', 'DoT', 'HSTS', 'LACP', 'IGMP', 'mDNS', 'LLMNR', 'WINS',
    'AXFR', 'IXFR', 'TSIG', 'SPF', 'DKIM', 'DMARC', 'MPLS', 'SD-WAN', 'OCSP'
  ],
  code: [
    'ICD-10', 'SNOMED', 'LOINC', 'CPT', 'DRG', 'CVE', 'CNAME', 'TTL', 'SSID',
    'LUN', 'GUID', 'UPN', 'SPN', 'CSR', 'OTP', 'JWT', 'IOC', 'IOA', 'DSCP',
    'PTR', 'SOA', 'RRSIG', 'SHA-256', 'MD5'
  ],
  metric: ['RTO', 'RPO', 'MTTR', 'MTBF', 'IOPS', 'SLO', 'SLI', 'QoS'],
  role: ['DBA', 'CAB', 'SOC'],
  hardware: [
    'UPS', 'PDU', 'CRAC', 'KVM', 'NIC', 'HBA', 'ADC', 'RFID', 'TPM', 'SSD',
    'HDD', 'HSM', 'NVMe', 'SATA', 'SAS', 'JBOD', 'SMART', 'PCR'
  ],
  record: ['MAR', 'eMAR', 'CRL', 'ACK', 'NACK', 'ORM', 'ORU', 'NDR', 'DSN', 'OST', 'PST'],
  network: ['WAN', 'LAN', 'MAN', 'VLAN', 'NAT', 'DMZ', 'PoE'],
  policy: [
    'BYOD', 'UAT', 'FIPS', 'ASR', 'DEP', 'ASLR', 'WDAC', 'GPO', 'OU', 'RBAC',
    'ACL', 'PKI', 'rsop', 'RSOP'
  ],
  event: ['DDoS'],
  storage: ['VMDK', 'VHD', 'DRS', 'NUMA', 'CMK']
};

const KIND_BY_WORD = new Map();
for (const [kind, words] of Object.entries(ACRONYM_KIND)) {
  for (const word of words) KIND_BY_WORD.set(word, kind);
}

const OFFICE_ACRONYM_EXAMPLES = {
  RSVP: ['Please send your RSVP (please reply) before Friday.', '请在周五前回复出席（RSVP，please reply）。'],
  FYI: ['I sent the downtime note FYI (for your information), no action needed.', '停机说明我已 FYI（仅供参考）发出，不用处理。'],
  CC: ['Please CC (carbon copy) the duty nurse on this email.', '这封邮件请抄送（CC）值班护士。'],
  BCC: ['BCC (blind carbon copy) the department head if they only need to watch.', '科主任只需知情的话，用密送（BCC）即可。'],
  EOD: ['Please send the count by EOD (end of day).', '请在 EOD（下班前）把盘点数发出来。'],
  COB: ['We need the sign-off by COB (close of business).', '请在 COB（下班前）完成签字。'],
  EOB: ['Please finish the claim by EOB (end of business).', '请在 EOB（业务结束前）把报销做完。'],
  KPI: ['This month’s KPI (key performance indicator) is ticket close time.', '这个月的 KPI（关键绩效指标）是工单关闭时长。'],
  SOP: ['Follow the SOP (standard operating procedure) before you reboot HIS.', '重启 HIS 前请按 SOP（标准作业程序）做。'],
  RACI: ['Please fill the RACI (responsible, accountable, consulted, informed) before kickoff.', '启动前请把 RACI（权责矩阵）填好。'],
  CAPA: ['Please close this CAPA (corrective and preventive action) before the survey.', '请在迎检前把这项 CAPA（纠正预防措施）关掉。'],
  AOB: ['Any AOB (any other business) before we adjourn?', '休会前还有 AOB（其他事项）吗？'],
  ETA: ['What is the vendor’s ETA (estimated time of arrival)?', '厂商的 ETA（预计到达时间）是几点？'],
  ETD: ['Confirm the ambulance ETD (estimated time of departure).', '请确认救护车的 ETD（预计出发时间）。'],
  TBA: ['The room is TBA (to be announced) on the invite.', '邀请上房间还是 TBA（待公布）。'],
  TBD: ['The owner is still TBD (to be determined).', '负责人还是 TBD（待确定）。'],
  'N/A': ['Mark unused fields N/A (not applicable), do not leave them empty.', '用不到的栏位请填 N/A（不适用），不要空着。'],
  WIP: ['This request is still WIP (work in progress).', '这个请求还是 WIP（进行中）。'],
  POC: ['Who is the POC (point of contact) for this vendor?', '这个厂商的 POC（对接人）是谁？'],
  SME: ['Please ask the SME (subject matter expert) before we change the form.', '改表前请先问 SME（业务专家）。'],
  PMO: ['Send the timeline to the PMO (project management office).', '请把时间线发给 PMO（项目管理办公室）。'],
  SLA: ['This ticket has already missed the SLA (service level agreement).', '这张工单已经超了 SLA（服务级别协议）。'],
  OLA: ['The OLA (operational level agreement) with the lab is two hours.', '和检验科的 OLA（运营级别协议）是两小时。'],
  PIP: ['HR asked us to keep this PIP (performance improvement plan) confidential.', '人事要求这份 PIP（绩效改进计划）保密。']
};

const VERB_EXAMPLES = {
  mute: ['Please mute your microphone during the webinar.', '开网络研讨会时请把麦克风静音。'],
  unmute: ['Unmute only when you need to speak.', '只有轮到你说话时再取消静音。'],
  deploy: ['We will deploy the patch after the outpatient clinic closes.', '门诊结束后我们再部署这个补丁。'],
  postpone: ['We had to postpone the HIS upgrade to Sunday night.', '我们不得不把 HIS 升级推迟到周日晚上。'],
  clarify: ['Can you clarify the ward requirement in the ticket?', '你能在工单里把病区需求写清楚吗？'],
  throttle: ['Throttle the interface if the lab analyzer falls behind.', '检验仪器跟不上时请把接口限流。'],
  adjourn: ['The chair adjourned the meeting at 10:30.', '主持人十点半宣布休会。'],
  decline: ['I will decline the overlapping invite and keep the change window.', '这个冲突的邀请我会拒绝，先保住变更窗口。'],
  accept: ['Please accept the meeting if you can join the walkthrough.', '如果能参加走查，请接受这个会议邀请。'],
  reschedule: ['We need to reschedule the drill because the ward is busy.', '病区正忙，演练需要改期。'],
  cancel: ['Cancel the vendor visit if the computer room is locked.', '机房上锁的话就取消厂商上门。'],
  confirm: ['Please confirm the downtime window with the duty nurse.', '请和值班护士确认停机窗口。'],
  escalate: ['Escalate to the vendor if the PACS archive is still full.', '影像归档还是满的话，就升级给厂商。'],
  archive: ['Archive last month’s change tickets before the audit.', '迎检前请把上个月的变更单归档。'],
  merge: ['Please merge the hotfix after UAT passes.', 'UAT 通过后再合并这个热修复。'],
  rebase: ['Rebase the patch branch onto last night’s build.', '请把补丁分支变基到昨晚的构建上。'],
  checkout: ['Checkout the rollback tag before you start.', '开始前先检出回滚标签。'],
  clone: ['Clone the playbook repo onto the jump host.', '请把剧本仓库克隆到跳板机上。'],
  'flush DNS': ['Flush DNS on the nurse station if the portal still points to the old IP.', '门户还指向旧地址的话，请在护士站刷新域名缓存。'],
  'drain node': ['Drain the node after the last clinic PC logs off.', '等最后一台门诊电脑退出后再排空这个节点。'],
  cordon: ['Cordon the node before you patch the kernel.', '打内核补丁前先封锁这个节点。'],
  uninstall: ['Uninstall the old client after the night batch.', '夜批结束后再卸载旧客户端。'],
  gpupdate: ['Run gpupdate on the shared PCs after the policy change.', '策略改完后请在共用电脑上刷新组策略。'],
  quarantine: ['Quarantine that workstation if EDR flags it.', '终端检测告警的话，先隔离那台电脑。'],
  degauss: ['Degauss the failed disk before it leaves the computer room.', '坏盘出机房前请先消磁。'],
  overcommit: ['Do not overcommit memory on the PACS hosts.', '影像主机上不要超分内存。'],
  onboard: ['Please onboard the new clerk before Thursday.', '请在周四前完成新文员的入职对接。'],
  offboard: ['Offboard her system access on the last day.', '最后一天请收回她的系统权限。'],
  'reply-all': ['Do not reply-all with the patient name.', '不要用全部回复带上患者姓名。'],
  attend: ['Can you attend the bed meeting for me?', '你能替我去开床位会吗？'],
  chair: ['Who will chair the morning huddle?', '晨会谁来主持？'],
  host: ['We will host the vendor in the training room.', '我们在培训室接待厂商。'],
  moderate: ['Please moderate the Q&A so it stays on time.', '请主持问答，别超时。'],
  welcome: ['Please welcome the new intern at the front desk.', '请在前台迎接新来的实习生。'],
  thank: ['Thank the night shift for covering the drill.', '谢谢夜班顶了这次演练。'],
  apologize: ['Please apologize to the ward for the late notice.', '通知晚了，请向病区道歉。'],
  congratulate: ['Congratulate the team after the go-live.', '上线后请祝贺一下团队。'],
  comply: ['We must comply with the privacy notice.', '我们必须遵守这份隐私告知。'],
  hire: ['We need to hire a weekend cover this month.', '这个月得招一个周末顶班。'],
  recruit: ['Please recruit two super users for the ward.', '请给病区招募两名骨干用户。'],
  nominate: ['Nominate one person from each unit.', '每个单元请提名一人。'],
  appoint: ['The director will appoint an acting lead.', '主任会任命一位代理组长。'],
  promote: ['They will promote her after the review.', '考核后会晋升她。'],
  recall: ['Recall the email if it went to the wrong group.', '如果发错组，请撤回邮件。'],
  unsubscribe: ['Unsubscribe from that vendor list.', '请退订那个厂商名单。'],
  shadow: ['Please shadow the duty clerk this morning.', '今天上午请跟岗值班文员。'],
  'cross-train': ['We will cross-train two people on the help window.', '我们会让两个人交叉培训服务窗口。'],
  upskill: ['The PMO asked us to upskill the super users.', '项目管理办公室要求提升骨干用户的技能。'],
  abstain: ['I will abstain if I was in the change window.', '如果我当时在变更窗口里，我会弃权。'],
  vote: ['Please vote on the Thursday slot.', '请对周四这个时段表决。'],
  'swap shift': ['Can you swap shift with night duty?', '你能和夜班换班吗？'],
  'cover shift': ['Who can cover shift on Saturday?', '周六谁能顶班？'],
  ping: ['Ping the duty nurse if the room is still locked.', '房间还锁着的话，提醒一下值班护士。'],
  nudge: ['Nudge finance if the invoice is still pending.', '发票还没处理的话，催一下财务。']
};

const ADJ_EXAMPLES = {
  'backward compatible': ['Keep the interface backward compatible for the old analyzers.', '接口要对旧仪器保持向后兼容。'],
  rootless: ['Run the helper as a rootless service.', '这个助手请按非特权方式运行。'],
  tentative: ['Mark Friday as tentative until the director confirms.', '主任确认前，周五先标成暂定。'],
  confidential: ['This roster is confidential; do not forward it.', '这份排班是保密的，不要转发。'],
  urgent: ['This request is urgent; please tell the ward.', '这个请求很紧急，请告诉病区。'],
  ASAP: ['Please send the list ASAP.', '请尽快把名单发来。'],
  'ad hoc': ['We added an ad hoc huddle after the outage.', '停机后又加了一场临时短会。'],
  responsible: ['Who is responsible for printing the minutes?', '会议纪要谁负责打印？'],
  accountable: ['The department head is accountable for the sign-off.', '签字由科主任最终负责。'],
  consulted: ['Nursing must be consulted before we change the form.', '改表前必须征询护理。'],
  informed: ['Keep the night lead informed of the delay.', '延误情况请知会夜班组长。'],
  overdue: ['The travel claim is overdue.', '差旅报销已经逾期。'],
  pending: ['The room booking is still pending.', '会议室预订还在待处理。'],
  'on-call': ['I am on-call tonight for HIS.', '今晚 HIS 我值班待命。'],
  elective: ['Move elective work off the peak hours.', '择期事项请避开高峰。'],
  biweekly: ['The quality meeting is biweekly.', '质量会是双周一次。'],
  fortnightly: ['We review the roster fortnightly.', '排班我们每两周看一次。'],
  quarterly: ['The audit is quarterly.', '审计是每季度一次。'],
  'year-end': ['Please freeze year-end changes after Friday.', '周五后请冻结年底变更。'],
  'mid-year': ['The mid-year review is next week.', '年中回顾在下周。'],
  'double-booked': ['The director is double-booked at ten.', '主任十点有时间冲突。'],
  overbooked: ['The training room is overbooked this morning.', '培训室今天上午排程过满。'],
  busy: ['The triage desk is busy; please wait.', '分诊台正忙，请稍等。'],
  available: ['I am available after the huddle.', '晨会后我有空。'],
  unavailable: ['She is unavailable until Thursday.', '她周四前没空。'],
  reachable: ['Keep a reachable number on the duty log.', '值班日志上请留一个能打通的号码。'],
  unreachable: ['The vendor was unreachable after five.', '五点后厂商联系不上。'],
  carried: ['The motion was carried.', '这项动议通过了。'],
  defeated: ['The overtime request was defeated.', '加班申请未通过。'],
  unanimous: ['The vote was unanimous.', '表决一致通过。'],
  acting: ['She is the acting team lead this week.', '这周她是代理组长。'],
  interim: ['He is the interim clerk until Friday.', '周五前他是临时文员。'],
  permanent: ['This is now a permanent post.', '这个岗位现在是正式编制。'],
  temporary: ['We hired temporary cover for night shift.', '我们招了临时人员顶夜班。'],
  'full-time': ['The vacancy is full-time.', '这个空缺是全职。'],
  'part-time': ['We only need part-time cover on weekends.', '周末只需要兼职顶班。'],
  illegible: ['The signature is illegible; please write it again.', '签名看不清，请再写一次。'],
  unsigned: ['Do not file an unsigned consent form.', '未签字的知情同意书不要归档。'],
  unstamped: ['The letter is still unstamped.', '这封信还没盖章。'],
  outdated: ['That SOP is outdated; use the current version.', '那份作业程序过时了，请用当前版本。'],
  superseded: ['This form has been superseded.', '这张表已被替代。']
};

function zhCore(meaning) {
  return meaning.replace(/（[^）]+）/g, '').replace(/\([^)]+\)/g, '').trim();
}

function expansionOf(word) {
  if (EXPANSIONS[word]) return EXPANSIONS[word];
  const upper = word.toUpperCase();
  if (EXPANSIONS[upper]) return EXPANSIONS[upper];
  const head = word.split(/[\s/]/)[0];
  return EXPANSIONS[head] || EXPANSIONS[head.toUpperCase()] || '';
}

function withExpansion(meaning, expansion) {
  if (!expansion) return meaning;
  if (meaning.includes(expansion) || /（.+）/.test(meaning)) return meaning;
  return `${meaning}（${expansion}）`;
}

function acronymKind(word) {
  return KIND_BY_WORD.get(word) || KIND_BY_WORD.get(word.toUpperCase()) || '';
}

function acronymExamples(word, expansion, category) {
  if (OFFICE_ACRONYM_EXAMPLES[word] || category === 'office') {
    return OFFICE_ACRONYM_EXAMPLES[word] || pick(`${word}|office-acr`, [
      [
        `Please write ${word} (${expansion}) in the notes so nobody has to guess.`,
        `请在记录里写上 ${word}（${expansion}），免得大家猜。`
      ],
      [
        `${word} means ${expansion}. Put it on the form if it applies.`,
        `${word} 表示 ${expansion}。适用的话请写在表上。`
      ]
    ]);
  }

  const kind = acronymKind(word);
  const templates = {
    system: [
      [`${word} stands for ${expansion}. Check it before the clinic opens.`, `${word} 的全称是 ${expansion}。开诊前请先检查。`],
      [`The ward called because ${word} (${expansion}) would not open.`, `病区来电，说 ${word}（${expansion}）打不开。`],
      [`Please write ${word} in full — ${expansion} — on the change form.`, `变更单上请写全称：${word}（${expansion}）。`],
      [`We tested ${word} (${expansion}) on the backup server first.`, `我们先在备机上测了 ${word}（${expansion}）。`],
      [`Do not restart ${word} (${expansion}) during morning rounds.`, `早交班时段不要重启 ${word}（${expansion}）。`]
    ],
    protocol: [
      [`Please confirm ${word} (${expansion}) is allowed through the firewall.`, `请确认防火墙放行 ${word}（${expansion}）。`],
      [`Document ${word} (${expansion}) in the interface spec.`, `接口说明里请写上 ${word}（${expansion}）。`],
      [`We use ${word} (${expansion}) for this integration.`, `这条集成用的是 ${word}（${expansion}）。`],
      [`Enable ${word} (${expansion}) on the test link first.`, `请先在测试链路上启用 ${word}（${expansion}）。`]
    ],
    code: [
      [`Please look up the ${word} (${expansion}) on this ticket.`, `请在这张工单上查一下 ${word}（${expansion}）。`],
      [`The report is missing a ${word} (${expansion}).`, `这份报告少了 ${word}（${expansion}）。`],
      [`Can you map this item to ${word} (${expansion})?`, `这条能否对照到 ${word}（${expansion}）？`],
      [`Record the ${word} (${expansion}) before you close the change.`, `关变更前请记下 ${word}（${expansion}）。`]
    ],
    metric: [
      [`Please report this week’s ${word} (${expansion}).`, `请汇报本周的 ${word}（${expansion}）。`],
      [`The change must meet the ${word} (${expansion}).`, `这次变更必须达到 ${word}（${expansion}）。`],
      [`Track ${word} (${expansion}) on the dashboard.`, `请在看板上跟踪 ${word}（${expansion}）。`],
      [`We missed the ${word} (${expansion}) last night.`, `昨晚我们没达到 ${word}（${expansion}）。`]
    ],
    role: [
      [`Ask the ${word} (${expansion}) before you change it.`, `改之前先问 ${word}（${expansion}）。`],
      [`The ${word} (${expansion}) will join the change window.`, `${word}（${expansion}）会参加这次变更窗口。`],
      [`Escalate to the ${word} (${expansion}) if it is still stuck.`, `还卡住的话，升级给 ${word}（${expansion}）。`],
      [`Who is the ${word} (${expansion}) this week?`, `这周 ${word}（${expansion}）是谁？`]
    ],
    hardware: [
      [`Check the ${word} (${expansion}) in the computer room.`, `请到机房检查 ${word}（${expansion}）。`],
      [`Replace the ${word} (${expansion}) after hours.`, `下班后再更换 ${word}（${expansion}）。`],
      [`The ${word} (${expansion}) alarm went off.`, `${word}（${expansion}）告警响了。`],
      [`Do not move the ${word} (${expansion}) during outpatient hours.`, `门诊时段不要挪动 ${word}（${expansion}）。`]
    ],
    record: [
      [`The ${word} (${expansion}) is missing on this chart.`, `这份记录少了 ${word}（${expansion}）。`],
      [`Please file the ${word} (${expansion}) before you close the ticket.`, `关单前请把 ${word}（${expansion}）归档。`],
      [`Check the ${word} (${expansion}) with the duty nurse.`, `请和值班护士核对 ${word}（${expansion}）。`],
      [`Send the ${word} (${expansion}) to the ward.`, `请把 ${word}（${expansion}）发给病区。`]
    ],
    network: [
      [`Check ${word} (${expansion}) connectivity from the ward.`, `请从病区检查 ${word}（${expansion}）连通性。`],
      [`We will cut over ${word} (${expansion}) after hours.`, `下班后我们再切换 ${word}（${expansion}）。`],
      [`Document the ${word} (${expansion}) change on the ticket.`, `请把 ${word}（${expansion}）变更写进工单。`],
      [`Test ${word} (${expansion}) from the backup site first.`, `请先从备站点测试 ${word}（${expansion}）。`]
    ],
    policy: [
      [`Follow the ${word} (${expansion}) policy.`, `请按 ${word}（${expansion}）的规定做。`],
      [`Schedule ${word} (${expansion}) before go-live.`, `上线前请安排 ${word}（${expansion}）。`],
      [`This device is not ${word} (${expansion}) approved.`, `这台设备不符合 ${word}（${expansion}）。`],
      [`Confirm ${word} (${expansion}) is in the change notes.`, `请确认变更说明里写了 ${word}（${expansion}）。`]
    ],
    event: [
      [`We saw a possible ${word} (${expansion}) alert.`, `我们看到可能的 ${word}（${expansion}）告警。`],
      [`Investigate the ${word} (${expansion}) on the edge router.`, `请在边缘路由器上排查 ${word}（${expansion}）。`],
      [`Block this ${word} (${expansion}) at the firewall.`, `请在防火墙上挡住这次 ${word}（${expansion}）。`]
    ],
    storage: [
      [`Check the ${word} (${expansion}) on the test host first.`, `请先在测试主机上检查 ${word}（${expansion}）。`],
      [`Do not move the ${word} (${expansion}) during outpatient hours.`, `门诊时段不要挪动 ${word}（${expansion}）。`],
      [`Document the ${word} (${expansion}) change on the ticket.`, `请把 ${word}（${expansion}）变更写进工单。`],
      [`We will verify the ${word} (${expansion}) after the night batch.`, `夜批结束后我们再核对 ${word}（${expansion}）。`]
    ]
  };

  return pick(`${word}|${kind || 'protocol'}`, templates[kind] || templates.protocol);
}

function verbExamples(word, meaning) {
  if (VERB_EXAMPLES[word]) return VERB_EXAMPLES[word];
  const zh = zhCore(meaning);
  return pick(`${word}|v`, [
    [`Please ${word} this before you leave.`, `走之前请把这件事${zh}。`],
    [`Can you ${word} it today?`, `你今天能把它${zh}吗？`],
    [`We still need to ${word} this.`, `这件事还得${zh}。`],
    [`Who will ${word} this after the huddle?`, `晨会后谁来${zh}？`]
  ]);
}

function adjExamples(word) {
  if (ADJ_EXAMPLES[word]) return ADJ_EXAMPLES[word];
  return [`This item is ${word}.`, `这一项是${word}。`];
}

function nounExamples(word, meaning, category) {
  const zh = zhCore(meaning);
  if (category === 'it') {
    return pick(`${word}|it`, [
      [`The ward asked us to check the ${word}.`, `病区让我们看一下这个${zh}。`],
      [`Please test the ${word} on the backup environment first.`, `请先在备用环境测试这个${zh}。`],
      [`I logged the ${word} in today’s change ticket.`, `我把这个${zh}记进了今天的变更单。`],
      [`Do not touch the ${word} during outpatient hours.`, `门诊时段不要动这个${zh}。`],
      [`We will verify the ${word} after the night batch.`, `夜批结束后我们再核对这个${zh}。`],
      [`Who is on call for the ${word} this week?`, `这周这个${zh}谁值班？`],
      [`The vendor asked for a screenshot of the ${word}.`, `厂商要一张这个${zh}的截图。`]
    ]);
  }
  return pick(`${word}|office`, [
    [`Please add the ${word} to today’s notes.`, `请把${zh}写进今天的记录。`],
    [`We talked about the ${word} with the department head.`, `我们和科主任谈了这个${zh}。`],
    [`Could you send the ${word} to the project group?`, `你能把${zh}发到项目群吗？`],
    [`The ${word} still needs a decision today.`, `这个${zh}今天还得拍个板。`],
    [`I put the ${word} on the shared drive.`, `我把${zh}放到了共享盘。`],
    [`Please bring the ${word} to the morning huddle.`, `早碰头时请带上这个${zh}。`],
    [`Who will own the ${word} this week?`, `这周这个${zh}谁来负责？`]
  ]);
}

export function enrichEntry(entry, kind = 'n') {
  const expansion = expansionOf(entry.word);
  const meaning = withExpansion(entry.meaning, expansion);
  if (entry.example?.trim() && entry.exampleZh?.trim()) {
    return {
      ...entry,
      meaning,
      example: entry.example.trim(),
      exampleZh: entry.exampleZh.trim()
    };
  }
  let pair;
  if (expansion && (kind === 'acr' || EXPANSIONS[entry.word] || EXPANSIONS[entry.word.toUpperCase()])) {
    pair = acronymExamples(entry.word, expansion, entry.category);
  } else if (kind === 'v') {
    pair = verbExamples(entry.word, meaning);
  } else if (kind === 'adj' || kind === 'adv') {
    pair = adjExamples(entry.word);
  } else {
    pair = nounExamples(entry.word, meaning, entry.category);
  }
  return {
    ...entry,
    meaning,
    example: pair[0],
    exampleZh: pair[1]
  };
}

export function looksTemplated(example) {
  return /is slow this morning|after the meeting|after the patch|Who supports this|I updated the .+ this morning|Please share the .+ after|Please put .+ on the email/.test(example);
}
